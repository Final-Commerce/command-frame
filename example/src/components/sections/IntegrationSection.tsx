import { useState } from 'react';
import { renderClient as command, TriggerWebhookPresetType } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface IntegrationSectionProps {
  isInIframe: boolean;
}

export function IntegrationSection({ isInIframe }: IntegrationSectionProps) {
  const [webhookUrl, setWebhookUrl] = useState<string>('https://example.com/webhook');
  const [webhookPublicKey, setWebhookPublicKey] = useState<string>('');
  const [webhookPresetData, setWebhookPresetData] = useState<boolean>(false);
  const [webhookPresetType, setWebhookPresetType] = useState<string>('');
  const [webhookIsCustomHook, setWebhookIsCustomHook] = useState<boolean>(false);
  const [webhookCustomHookData, setWebhookCustomHookData] = useState<string>('');
  const [webhookPayloadType, setWebhookPayloadType] = useState<string>('json');
  const [triggerWebhookLoading, setTriggerWebhookLoading] = useState(false);
  const [triggerWebhookResponse, setTriggerWebhookResponse] = useState<string>('');

  const [zapierTriggerUrl, setZapierTriggerUrl] = useState<string>('https://hooks.zapier.com/hooks/catch/123456/abcdef');
  const [triggerZapierLoading, setTriggerZapierLoading] = useState(false);
  const [triggerZapierResponse, setTriggerZapierResponse] = useState<string>('');

  const handleTriggerWebhook = async () => {
    if (!isInIframe) {
      setTriggerWebhookResponse('Error: Not running in iframe');
      return;
    }

    if (!webhookUrl) {
      setTriggerWebhookResponse('Error: Webhook URL is required');
      return;
    }

    setTriggerWebhookLoading(true);
    setTriggerWebhookResponse('');

    try {
      const result = await command.triggerWebhook({
        webhookUrl,
        publicKey: webhookPublicKey || undefined,
        presetData: webhookPresetData,
        presetType: (webhookPresetType as TriggerWebhookPresetType) || undefined,
        isCustomHook: webhookIsCustomHook,
        customHookData: webhookCustomHookData || undefined,
        payloadType: webhookPayloadType,
      });
      setTriggerWebhookResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setTriggerWebhookResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTriggerWebhookLoading(false);
    }
  };

  const handleTriggerZapierWebhook = async () => {
    if (!isInIframe) {
      setTriggerZapierResponse('Error: Not running in iframe');
      return;
    }

    if (!zapierTriggerUrl) {
      setTriggerZapierResponse('Error: Trigger URL is required');
      return;
    }

    setTriggerZapierLoading(true);
    setTriggerZapierResponse('');

    try {
      const result = await command.triggerZapierWebhook({
        triggerUrl: zapierTriggerUrl
      });
      setTriggerZapierResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setTriggerZapierResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTriggerZapierLoading(false);
    }
  };

  return (
    <div className="section-content">
      <CommandSection title="Trigger Webhook">
        <p className="section-description">
          Triggers a webhook with the specified configuration.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Webhook URL:</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://example.com/webhook"
            />
          </div>
          <div className="form-field">
            <label>Public Key (optional):</label>
            <input
              type="text"
              value={webhookPublicKey}
              onChange={(e) => setWebhookPublicKey(e.target.value)}
              placeholder="Public key"
            />
          </div>
          <div className="form-field">
            <label>Payload Type:</label>
            <select
              value={webhookPayloadType}
              onChange={(e) => setWebhookPayloadType(e.target.value)}
            >
              <option value="json">JSON</option>
              <option value="form-urlencoded">Form URL Encoded</option>
            </select>
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={webhookPresetData}
                onChange={(e) => setWebhookPresetData(e.target.checked)}
              />
              <span>Preset Data</span>
            </label>
          </div>
          {webhookPresetData && (
            <div className="form-field">
              <label>Preset Type:</label>
              <input
                type="text"
                value={webhookPresetType}
                onChange={(e) => setWebhookPresetType(e.target.value)}
                placeholder="order, cart, etc."
              />
            </div>
          )}
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={webhookIsCustomHook}
                onChange={(e) => setWebhookIsCustomHook(e.target.checked)}
              />
              <span>Is Custom Hook</span>
            </label>
          </div>
          {webhookIsCustomHook && (
            <div className="form-field">
              <label>Custom Hook Data:</label>
              <textarea
                value={webhookCustomHookData}
                onChange={(e) => setWebhookCustomHookData(e.target.value)}
                placeholder="Custom hook data"
                rows={3}
              />
            </div>
          )}
        </div>
        <button
          onClick={handleTriggerWebhook}
          disabled={triggerWebhookLoading}
          className="btn btn--primary"
        >
          {triggerWebhookLoading ? 'Triggering...' : 'Trigger Webhook'}
        </button>
        {triggerWebhookResponse && (
          <JsonViewer
            data={triggerWebhookResponse}
            title={triggerWebhookResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Trigger Zapier Webhook">
        <p className="section-description">
          Triggers a Zapier webhook with the current context data.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Trigger URL:</label>
            <input
              type="text"
              value={zapierTriggerUrl}
              onChange={(e) => setZapierTriggerUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/..."
            />
          </div>
        </div>
        <button
          onClick={handleTriggerZapierWebhook}
          disabled={triggerZapierLoading}
          className="btn btn--primary"
        >
          {triggerZapierLoading ? 'Triggering...' : 'Trigger Zapier Webhook'}
        </button>
        {triggerZapierResponse && (
          <JsonViewer
            data={triggerZapierResponse}
            title={triggerZapierResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>
    </div>
  );
}

