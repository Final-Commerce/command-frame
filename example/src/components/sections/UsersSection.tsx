import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface UsersSectionProps {
  isInIframe: boolean;
}

export function UsersSection({ isInIframe }: UsersSectionProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string>('');
  const [outletsFilter, setOutletsFilter] = useState<string>('');
  const [activeUserId, setActiveUserId] = useState<string>('');
  const [setActiveUserLoading, setSetActiveUserLoading] = useState(false);
  const [setActiveUserResponse, setSetActiveUserResponse] = useState<string>('');
  const [getActiveUserLoading, setGetActiveUserLoading] = useState(false);
  const [getActiveUserResponse, setGetActiveUserResponse] = useState<string>('');

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
                  <th className="text-right">Action</th>
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
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => setActiveUserId(user._id || user.id)}
                        className="btn btn--small"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CommandSection>

      <CommandSection title="Get Active User">
        <p className="section-description">Returns the active POS user (employee) from state.</p>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setGetActiveUserResponse('Error: Not running in iframe');
              return;
            }
            setGetActiveUserLoading(true);
            setGetActiveUserResponse('');
            try {
              const result = await command.getActiveUser();
              setGetActiveUserResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setGetActiveUserResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setGetActiveUserLoading(false);
            }
          }}
          disabled={getActiveUserLoading}
          className="btn btn--primary"
        >
          {getActiveUserLoading ? 'Loading...' : 'Get Active User'}
        </button>
        {getActiveUserResponse && (
          <JsonViewer
            data={getActiveUserResponse}
            title={getActiveUserResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Set Active User">
        <p className="section-description">Loads a user by id and sets as the active POS user.</p>
        <div className="form-group">
          <label className="form-label">User ID:</label>
          <input
            type="text"
            value={activeUserId}
            onChange={(e) => setActiveUserId(e.target.value)}
            className="form-input"
            placeholder="user-id"
          />
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setSetActiveUserResponse('Error: Not running in iframe');
              return;
            }
            if (!activeUserId) {
              setSetActiveUserResponse('Error: Please enter a user ID');
              return;
            }
            setSetActiveUserLoading(true);
            setSetActiveUserResponse('');
            try {
              const result = await command.setActiveUser({ userId: activeUserId });
              setSetActiveUserResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setSetActiveUserResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setSetActiveUserLoading(false);
            }
          }}
          disabled={setActiveUserLoading}
          className="btn btn--primary"
        >
          {setActiveUserLoading ? 'Setting...' : 'Set Active User'}
        </button>
        {setActiveUserResponse && (
          <JsonViewer
            data={setActiveUserResponse}
            title={setActiveUserResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>
    </div>
  );
}
