import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface RolesSectionProps {
  isInIframe: boolean;
}

export function RolesSection({ isInIframe: _ }: RolesSectionProps) {
  const [roles, setRoles] = useState<any[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState<string>('');
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);

  // Check Permission
  const [permissionName, setPermissionName] = useState<string>('issue_refunds');
  const [checkPermissionLoading, setCheckPermissionLoading] = useState(false);
  const [checkPermissionResponse, setCheckPermissionResponse] = useState<string>('');

  const handleGetRoles = async () => {
    setRolesLoading(true);
    setRoles([]);
    setRolesError('');
    setExpandedRoleId(null);

    try {
      const result = await command.getRoles({});

      if (result && result.roles && Array.isArray(result.roles)) {
        setRoles(result.roles);
      } else {
        setRolesError(`Unexpected response format: ${JSON.stringify(result).substring(0, 100)}`);
      }
    } catch (error) {
      setRolesError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setRolesLoading(false);
    }
  };

  const toggleExpand = (roleId: string) => {
    setExpandedRoleId((prev) => (prev === roleId ? null : roleId));
  };

  return (
    <div className="section-content">
      <CommandSection title="Check Permission">
        <p className="section-description">
          Read-only: does the ACTIVE user hold a named permission? Use it to pre-gate UI (e.g. hide the Refund button
          when <code>issue_refunds</code> is missing) — the mutating refund commands enforce it runtime-side regardless
          (<code>REFUND_PERMISSION_DENIED</code>). Mock: every permission is allowed except <code>mock_denied</code>.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Permission name:</label>
            <input
              type="text"
              value={permissionName}
              onChange={(e) => setPermissionName(e.target.value)}
              placeholder="issue_refunds"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!permissionName.trim()) {
              setCheckPermissionResponse('Error: Please enter a permission name');
              return;
            }
            setCheckPermissionLoading(true);
            setCheckPermissionResponse('');
            try {
              const result = await command.checkPermission({ permission: permissionName.trim() });
              setCheckPermissionResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setCheckPermissionResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setCheckPermissionLoading(false);
            }
          }}
          disabled={checkPermissionLoading}
          className="btn btn--primary"
        >
          {checkPermissionLoading ? 'Checking...' : 'Check Permission'}
        </button>
        {checkPermissionResponse && (
          <JsonViewer
            data={checkPermissionResponse}
            title={checkPermissionResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Get Roles">
        <p className="section-description">Fetches all roles for the current company, including their permissions.</p>
        <button onClick={handleGetRoles} disabled={rolesLoading} className="btn btn--primary">
          {rolesLoading ? 'Loading...' : 'Get Roles'}
        </button>

        {rolesError && <JsonViewer data={rolesError} title="Error" />}

        {roles.length > 0 && (
          <div className="data-table-wrapper">
            <h4>Roles ({roles.length})</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Permissions</th>
                  <th className="text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => {
                  const roleId = role._id || role.id || String(index);
                  const isExpanded = expandedRoleId === roleId;
                  return (
                    <>
                      <tr key={roleId}>
                        <td>{role.name}</td>
                        <td>{role.permissions?.filter((p: any) => p.value === true).length ?? 0}</td>
                        <td className="text-right">
                          <button onClick={() => toggleExpand(roleId)} className="btn btn--small">
                            {isExpanded ? 'Hide' : 'Show'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${roleId}-details`}>
                          <td colSpan={3}>
                            <JsonViewer
                              data={JSON.stringify(role.permissions, null, 2)}
                              title={`${role.name} Permissions`}
                            />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CommandSection>
    </div>
  );
}
