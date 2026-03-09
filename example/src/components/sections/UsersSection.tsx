import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface UsersSectionProps {
  isInIframe: boolean;
}

export function UsersSection({ isInIframe: _ }: UsersSectionProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string>('');
  const [outletsFilter, setOutletsFilter] = useState<string>('');

  const handleGetUsers = async () => {
    setUsersLoading(true);
    setUsers([]);
    setUsersError('');

    try {
      const outlets = outletsFilter
        ? outletsFilter.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined;

      const result = await command.getUsers(outlets ? { outlets } : {});

      if (result && result.users && Array.isArray(result.users)) {
        setUsers(result.users);
      } else {
        setUsersError(`Unexpected response format: ${JSON.stringify(result).substring(0, 100)}`);
      }
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setUsersLoading(false);
    }
  };

  return (
    <div className="section-content">
      <CommandSection title="Get Users">
        <p className="section-description">
          Fetches the list of users for the current company. Optionally filter by outlet IDs.
        </p>
        <div className="form-group">
          <label className="form-label">Outlet IDs (comma-separated, optional):</label>
          <input
            type="text"
            value={outletsFilter}
            onChange={(e) => setOutletsFilter(e.target.value)}
            className="form-input"
            placeholder="outlet-id-1, outlet-id-2"
          />
        </div>
        <button
          onClick={handleGetUsers}
          disabled={usersLoading}
          className="btn btn--primary"
        >
          {usersLoading ? 'Loading...' : 'Get Users'}
        </button>

        {usersError && <JsonViewer data={usersError} title="Error" />}

        {users.length > 0 && (
          <div className="data-table-wrapper">
            <h4>Users ({users.length})</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id || user.id || index}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email || '—'}</td>
                    <td>{user.phone || '—'}</td>
                    <td>{user.type || '—'}</td>
                    <td>{user.role?.name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CommandSection>
    </div>
  );
}
