import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface SecretsSectionProps {
  isInIframe: boolean;
}

export function SecretsSection({ isInIframe }: SecretsSectionProps) {
  const [getKeysExtensionId, setGetKeysExtensionId] = useState<string>('');
  const [getKeysLoading, setGetKeysLoading] = useState(false);
  const [getKeysResponse, setGetKeysResponse] = useState<string>('');

  const [getValKey, setGetValKey] = useState<string>('');
  const [getValExtensionId, setGetValExtensionId] = useState<string>('');
  const [getValLoading, setGetValLoading] = useState(false);
  const [getValResponse, setGetValResponse] = useState<string>('');

  const [setValKey, setSetValKey] = useState<string>('');
  const [setValValue, setSetValValue] = useState<string>('');
  const [setValExtensionId, setSetValExtensionId] = useState<string>('');
  const [setValLoading, setSetValLoading] = useState(false);
  const [setValResponse, setSetValResponse] = useState<string>('');

  const handleGetSecretsKeys = async () => {
    if (!isInIframe) {
      setGetKeysResponse('Error: Not running in iframe');
      return;
    }

    setGetKeysLoading(true);
    setGetKeysResponse('');

    try {
      const result = await command.getSecretsKeys(
        getKeysExtensionId ? { extensionId: getKeysExtensionId } : undefined
      );
      setGetKeysResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setGetKeysResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setGetKeysLoading(false);
    }
  };

  const handleGetSecretVal = async () => {
    if (!isInIframe) {
      setGetValResponse('Error: Not running in iframe');
      return;
    }

    if (!getValKey.trim()) {
      setGetValResponse('Error: Key is required');
      return;
    }

    setGetValLoading(true);
    setGetValResponse('');

    try {
      const result = await command.getSecretVal({
        key: getValKey.trim(),
        ...(getValExtensionId ? { extensionId: getValExtensionId } : {}),
      });
      setGetValResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setGetValResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setGetValLoading(false);
    }
  };

  const handleSetSecretVal = async () => {
    if (!isInIframe) {
      setSetValResponse('Error: Not running in iframe');
      return;
    }

    if (!setValKey.trim()) {
      setSetValResponse('Error: Key is required');
      return;
    }

    setSetValLoading(true);
    setSetValResponse('');

    try {
      const result = await command.setSecretVal({
        key: setValKey.trim(),
        value: setValValue,
        ...(setValExtensionId ? { extensionId: setValExtensionId } : {}),
      });
      setSetValResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setSetValResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSetValLoading(false);
    }
  };

  return (
    <div className="section-content">
      <CommandSection title="Get Secrets Keys">
        <p className="section-description">
          Retrieves the list of secret keys. Omit extension ID for company-level keys; provide it for extension-scoped keys.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Extension ID (optional):</label>
            <input
              type="text"
              value={getKeysExtensionId}
              onChange={(e) => setGetKeysExtensionId(e.target.value)}
              placeholder="Leave empty for company-level"
            />
          </div>
        </div>
        <button
          onClick={handleGetSecretsKeys}
          disabled={getKeysLoading}
          className="btn btn--primary"
        >
          {getKeysLoading ? 'Loading...' : 'Get Secrets Keys'}
        </button>
        {getKeysResponse && (
          <JsonViewer
            data={getKeysResponse}
            title={getKeysResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Get Secret Value">
        <p className="section-description">
          Retrieves a secret value by key. Use extension ID for extension-scoped secrets.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Key:</label>
            <input
              type="text"
              value={getValKey}
              onChange={(e) => setGetValKey(e.target.value)}
              placeholder="Secret key name"
            />
          </div>
          <div className="form-field">
            <label>Extension ID (optional):</label>
            <input
              type="text"
              value={getValExtensionId}
              onChange={(e) => setGetValExtensionId(e.target.value)}
              placeholder="Leave empty for company-level"
            />
          </div>
        </div>
        <button
          onClick={handleGetSecretVal}
          disabled={getValLoading}
          className="btn btn--primary"
        >
          {getValLoading ? 'Loading...' : 'Get Secret Value'}
        </button>
        {getValResponse && (
          <JsonViewer
            data={getValResponse}
            title={getValResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Set Secret Value">
        <p className="section-description">
          Creates or updates a secret. Use extension ID for extension-scoped secrets.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Key:</label>
            <input
              type="text"
              value={setValKey}
              onChange={(e) => setSetValKey(e.target.value)}
              placeholder="Secret key name"
            />
          </div>
          <div className="form-field">
            <label>Value:</label>
            <input
              type="text"
              value={setValValue}
              onChange={(e) => setSetValValue(e.target.value)}
              placeholder="Secret value"
            />
          </div>
          <div className="form-field">
            <label>Extension ID (optional):</label>
            <input
              type="text"
              value={setValExtensionId}
              onChange={(e) => setSetValExtensionId(e.target.value)}
              placeholder="Leave empty for company-level"
            />
          </div>
        </div>
        <button
          onClick={handleSetSecretVal}
          disabled={setValLoading}
          className="btn btn--primary"
        >
          {setValLoading ? 'Saving...' : 'Set Secret Value'}
        </button>
        {setValResponse && (
          <JsonViewer
            data={setValResponse}
            title={setValResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>
    </div>
  );
}
