import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface SystemSectionProps {
  isInIframe: boolean;
}

export function SystemSection({ isInIframe }: SystemSectionProps) {
  // Navigation
  const [goToHomeLoading, setGoToHomeLoading] = useState(false);
  const [goToHomeResponse, setGoToHomeResponse] = useState<string>('');

  // UI Actions
  const [notificationMessage, setNotificationMessage] = useState<string>('Hello from iframe!');
  const [showNotificationLoading, setShowNotificationLoading] = useState(false);
  const [showNotificationResponse, setShowNotificationResponse] = useState<string>('');
  const [confirmationMessage, setConfirmationMessage] = useState<string>('Are you sure?');
  const [showConfirmationLoading, setShowConfirmationLoading] = useState(false);
  const [showConfirmationResponse, setShowConfirmationResponse] = useState<string>('');

  // Authentication
  const [roleIds, setRoleIds] = useState<string>('');
  const [authenticateLoading, setAuthenticateLoading] = useState(false);
  const [authenticateResponse, setAuthenticateResponse] = useState<string>('');

  // Customer Facing Display
  // const [cfdPageId, setCfdPageId] = useState<string>('');
  // const [updateCfdLoading, setUpdateCfdLoading] = useState(false);
  // const [updateCfdResponse, setUpdateCfdResponse] = useState<string>('');

  // Switch User
  const [switchUserMode, setSwitchUserMode] = useState<'dialog' | 'role' | 'specific'>('dialog');
  const [switchUserRoleIds, setSwitchUserRoleIds] = useState<string>('');
  const [switchUserId, setSwitchUserId] = useState<string>('');
  const [switchUserLoading, setSwitchUserLoading] = useState(false);
  const [switchUserResponse, setSwitchUserResponse] = useState<string>('');

  const handleGoToHome = async () => {
    if (!isInIframe) {
      setGoToHomeResponse('Error: Not running in iframe');
      return;
    }

    setGoToHomeLoading(true);
    setGoToHomeResponse('');

    try {
      const result = await command.goToStationHome();
      setGoToHomeResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setGoToHomeResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setGoToHomeLoading(false);
    }
  };

  const handleOpenCashDrawer = async () => {
    if (!isInIframe) {
      return;
    }

    try {
      await command.openCashDrawer();
    } catch (error) {
      console.error('Error opening cash drawer:', error);
    }
  };

  const handleShowNotification = async () => {
    if (!isInIframe) {
      setShowNotificationResponse('Error: Not running in iframe');
      return;
    }

    if (!notificationMessage) {
      setShowNotificationResponse('Error: Message is required');
      return;
    }

    setShowNotificationLoading(true);
    setShowNotificationResponse('');

    try {
      const result = await command.showNotification({ message: notificationMessage });
      setShowNotificationResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setShowNotificationResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setShowNotificationLoading(false);
    }
  };

  const handleShowConfirmation = async () => {
    if (!isInIframe) {
      setShowConfirmationResponse('Error: Not running in iframe');
      return;
    }

    if (!confirmationMessage) {
      setShowConfirmationResponse('Error: Message is required');
      return;
    }

    setShowConfirmationLoading(true);
    setShowConfirmationResponse('');

    try {
      const result = await command.showConfirmation({ message: confirmationMessage });
      setShowConfirmationResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setShowConfirmationResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setShowConfirmationLoading(false);
    }
  };

  const handleAuthenticateUser = async () => {
    if (!isInIframe) {
      setAuthenticateResponse('Error: Not running in iframe');
      return;
    }

    if (!roleIds) {
      setAuthenticateResponse('Error: Role IDs are required');
      return;
    }

    setAuthenticateLoading(true);
    setAuthenticateResponse('');

    try {
      const roleIdsArray = roleIds.split(',').map(id => id.trim()).filter(id => id);
      const result = await command.authenticateUser({ roleIds: roleIdsArray });
      setAuthenticateResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setAuthenticateResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setAuthenticateLoading(false);
    }
  };

  const handleSwitchUser = async () => {
    if (!isInIframe) {
      setSwitchUserResponse('Error: Not running in iframe');
      return;
    }

    setSwitchUserLoading(true);
    setSwitchUserResponse('');

    try {
      let params: any = { mode: switchUserMode };
      if (switchUserMode === 'role') {
        if (!switchUserRoleIds) {
          throw new Error('Role IDs are required for role mode');
        }
        params.roleIds = switchUserRoleIds.split(',').map(id => id.trim()).filter(id => id);
      } else if (switchUserMode === 'specific') {
        if (!switchUserId) {
          throw new Error('User ID is required for specific mode');
        }
        params.userId = switchUserId;
      }

      const result = await command.switchUser(params);
      setSwitchUserResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setSwitchUserResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSwitchUserLoading(false);
    }
  };

  return (
    <div className="section-content">
      <CommandSection title="Go to Station Home">
        <p className="section-description">
          Navigates to the station home page.
        </p>
        <button
          onClick={handleGoToHome}
          disabled={goToHomeLoading}
          className="btn btn--primary"
        >
          {goToHomeLoading ? 'Navigating...' : 'Go to Home'}
        </button>
        {goToHomeResponse && (
          <JsonViewer
            data={goToHomeResponse}
            title={goToHomeResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Open Cash Drawer">
        <p className="section-description">
          Opens the cash drawer (if connected).
        </p>
        <button
          onClick={handleOpenCashDrawer}
          className="btn btn--primary"
        >
          Open Cash Drawer
        </button>
      </CommandSection>

      <CommandSection title="Show Notification">
        <p className="section-description">
          Shows a notification message to the user.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Message:</label>
            <input
              type="text"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Notification message"
            />
          </div>
        </div>
        <button
          onClick={handleShowNotification}
          disabled={showNotificationLoading}
          className="btn btn--primary"
        >
          {showNotificationLoading ? 'Showing...' : 'Show Notification'}
        </button>
        {showNotificationResponse && (
          <JsonViewer
            data={showNotificationResponse}
            title={showNotificationResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Show Confirmation">
        <p className="section-description">
          Shows a confirmation dialog to the user.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Message:</label>
            <input
              type="text"
              value={confirmationMessage}
              onChange={(e) => setConfirmationMessage(e.target.value)}
              placeholder="Confirmation message"
            />
          </div>
        </div>
        <button
          onClick={handleShowConfirmation}
          disabled={showConfirmationLoading}
          className="btn btn--primary"
        >
          {showConfirmationLoading ? 'Showing...' : 'Show Confirmation'}
        </button>
        {showConfirmationResponse && (
          <JsonViewer
            data={showConfirmationResponse}
            title={showConfirmationResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Authenticate User">
        <p className="section-description">
          Triggers user authentication for specific roles.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Role IDs (comma-separated):</label>
            <input
              type="text"
              value={roleIds}
              onChange={(e) => setRoleIds(e.target.value)}
              placeholder="role-123, role-456"
            />
          </div>
        </div>
        <button
          onClick={handleAuthenticateUser}
          disabled={authenticateLoading}
          className="btn btn--primary"
        >
          {authenticateLoading ? 'Authenticating...' : 'Authenticate'}
        </button>
        {authenticateResponse && (
          <JsonViewer
            data={authenticateResponse}
            title={authenticateResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Switch User">
        <p className="section-description">
          Switches the current user to a different user.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Mode:</label>
            <select
              value={switchUserMode}
              onChange={(e) => setSwitchUserMode(e.target.value as 'dialog' | 'role' | 'specific')}
            >
              <option value="dialog">Dialog (Select from all users)</option>
              <option value="role">Role (Select from users with specific roles)</option>
              <option value="specific">Specific (Switch to specific user)</option>
            </select>
          </div>
          {switchUserMode === 'role' && (
            <div className="form-field">
              <label>Role IDs (comma-separated):</label>
              <input
                type="text"
                value={switchUserRoleIds}
                onChange={(e) => setSwitchUserRoleIds(e.target.value)}
                placeholder="role-123, role-456"
              />
            </div>
          )}
          {switchUserMode === 'specific' && (
            <div className="form-field">
              <label>User ID:</label>
              <input
                type="text"
                value={switchUserId}
                onChange={(e) => setSwitchUserId(e.target.value)}
                placeholder="user-123"
              />
            </div>
          )}
        </div>
        <button
          onClick={handleSwitchUser}
          disabled={switchUserLoading}
          className="btn btn--primary"
        >
          {switchUserLoading ? 'Switching...' : 'Switch User'}
        </button>
        {switchUserResponse && (
          <JsonViewer
            data={switchUserResponse}
            title={switchUserResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>
    </div>
  );
}

