import { useState } from 'react';
import {
  renderClient as command,
  type ExtensionPaymentParams,
  type RedeemPaymentParams,
  type IntegrationPaymentParams,
  type IntegrationEmvData
} from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface PaymentsSectionProps {
  isInIframe: boolean;
}

export function PaymentsSection({ isInIframe }: PaymentsSectionProps) {
  // Cash Payment
  const [cashPaymentAmount, setCashPaymentAmount] = useState<string>('');
  const [cashPaymentLoading, setCashPaymentLoading] = useState(false);
  const [cashPaymentResponse, setCashPaymentResponse] = useState<string>('');
  const [openChangeCalculator, setOpenChangeCalculator] = useState<boolean>(false);

  // Tap to Pay
  const [tapToPayAmount, setTapToPayAmount] = useState<string>('');
  const [tapToPayLoading, setTapToPayLoading] = useState(false);
  const [tapToPayResponse, setTapToPayResponse] = useState<string>('');

  // Terminal Payment
  const [terminalAmount, setTerminalAmount] = useState<string>('');
  const [terminalLoading, setTerminalLoading] = useState(false);
  const [terminalResponse, setTerminalResponse] = useState<string>('');

  // Vendara Payment
  const [vendaraAmount, setVendaraAmount] = useState<string>('');
  const [vendaraLoading, setVendaraLoading] = useState(false);
  const [vendaraResponse, setVendaraResponse] = useState<string>('');

  // Redeem (gift card / extension) — calls wire action `redeemPayment` → host routes like Render Phase 2
  const [redeemAmount, setRedeemAmount] = useState<string>('');
  const [redeemProcessor, setRedeemProcessor] = useState<string>('giftCard');
  const [redeemLabel, setRedeemLabel] = useState<string>('');
  const [redeemExtensionId, setRedeemExtensionId] = useState<string>('');
  const [redeemReferenceId, setRedeemReferenceId] = useState<string>('');
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemResponse, setRedeemResponse] = useState<string>('');

  // Integration payment (Stripe-like) — calls `integrationPayment` → host routes with paymentType "integration"
  const [integrationAmount, setIntegrationAmount] = useState<string>('');
  // emvData is a typed object; fields are camelCase, host maps to canonical EMV keys.
  const [integrationEmvBrand, setIntegrationEmvBrand] = useState<string>('Visa');
  const [integrationEmvLast4, setIntegrationEmvLast4] = useState<string>('');
  const [integrationEmvCardholder, setIntegrationEmvCardholder] = useState<string>('');
  const [integrationEmvExpiry, setIntegrationEmvExpiry] = useState<string>('');
  const [integrationEmvCountry, setIntegrationEmvCountry] = useState<string>('');
  const [integrationEmvIssuer, setIntegrationEmvIssuer] = useState<string>('');
  const [integrationProcessor, setIntegrationProcessor] = useState<string>('Stripe');
  const [integrationLabel, setIntegrationLabel] = useState<string>('');
  const [integrationExtensionId, setIntegrationExtensionId] = useState<string>('');
  const [integrationReferenceId, setIntegrationReferenceId] = useState<string>('');
  const [integrationProcessorFee, setIntegrationProcessorFee] = useState<string>('');
  const [integrationLoading, setIntegrationLoading] = useState(false);
  const [integrationResponse, setIntegrationResponse] = useState<string>('');

  // Generic extension payment — calls `extensionPayment` with a paymentType (e.g. redeem, integration, or future wallet/points)
  const [extPaymentType, setExtPaymentType] = useState<string>('redeem');
  const [extAmount, setExtAmount] = useState<string>('');
  const [extProcessor, setExtProcessor] = useState<string>('giftCard');
  const [extLabel, setExtLabel] = useState<string>('');
  const [extLoading, setExtLoading] = useState(false);
  const [extResponse, setExtResponse] = useState<string>('');

  // Partial Payment
  const [partialPaymentAmount, setPartialPaymentAmount] = useState<string>('');
  const [partialPaymentIsPercent, setPartialPaymentIsPercent] = useState<boolean>(false);
  const [partialPaymentOpenUI, setPartialPaymentOpenUI] = useState<boolean>(false);
  const [partialPaymentLoading, setPartialPaymentLoading] = useState(false);
  const [partialPaymentResponse, setPartialPaymentResponse] = useState<string>('');

  return (
    <div className="section-content">
      {/* Cash Payment */}
      <CommandSection title="Cash Payment">
        <p className="section-description">
          Processes a cash payment. Leave amount empty to use cart total.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Amount (optional):</label>
            <input
              type="number"
              step="0.01"
              value={cashPaymentAmount}
              onChange={(e) => setCashPaymentAmount(e.target.value)}
              placeholder="Leave empty for cart total"
            />
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={openChangeCalculator}
                onChange={(e) => setOpenChangeCalculator(e.target.checked)}
              />
              <span>Open Change Calculator</span>
            </label>
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setCashPaymentResponse('Error: Not running in iframe');
              return;
            }
            setCashPaymentLoading(true);
            setCashPaymentResponse('');
            try {
              const params: any = {};
              if (cashPaymentAmount) params.amount = parseFloat(cashPaymentAmount);
              if (openChangeCalculator) params.openChangeCalculator = true;
              
              const result = await command.cashPayment(Object.keys(params).length > 0 ? params : undefined);
              setCashPaymentResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setCashPaymentResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setCashPaymentLoading(false);
            }
          }}
          disabled={cashPaymentLoading}
          className="btn btn--success"
        >
          {cashPaymentLoading ? 'Processing...' : 'Cash Payment'}
        </button>
        {cashPaymentResponse && (
          <JsonViewer
            data={cashPaymentResponse}
            title={cashPaymentResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Tap to Pay */}
      <CommandSection title="Tap to Pay Payment">
        <p className="section-description">
          Initiates a Tap to Pay payment. Leave amount empty to use cart total.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Amount (optional):</label>
            <input
              type="number"
              step="0.01"
              value={tapToPayAmount}
              onChange={(e) => setTapToPayAmount(e.target.value)}
              placeholder="Leave empty for cart total"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setTapToPayResponse('Error: Not running in iframe');
              return;
            }
            setTapToPayLoading(true);
            setTapToPayResponse('');
            try {
              const result = await command.tapToPayPayment(tapToPayAmount ? { amount: parseFloat(tapToPayAmount) } : undefined);
              setTapToPayResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setTapToPayResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setTapToPayLoading(false);
            }
          }}
          disabled={tapToPayLoading}
          className="btn btn--primary"
        >
          {tapToPayLoading ? 'Processing...' : 'Tap to Pay'}
        </button>
        {tapToPayResponse && (
          <JsonViewer
            data={tapToPayResponse}
            title={tapToPayResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Terminal Payment */}
      <CommandSection title="Terminal Payment">
        <p className="section-description">
          Initiates a terminal payment. Leave amount empty to use cart total.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Amount (optional):</label>
            <input
              type="number"
              step="0.01"
              value={terminalAmount}
              onChange={(e) => setTerminalAmount(e.target.value)}
              placeholder="Leave empty for cart total"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setTerminalResponse('Error: Not running in iframe');
              return;
            }
            setTerminalLoading(true);
            setTerminalResponse('');
            try {
              const result = await command.terminalPayment(terminalAmount ? { amount: parseFloat(terminalAmount) } : undefined);
              setTerminalResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setTerminalResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setTerminalLoading(false);
            }
          }}
          disabled={terminalLoading}
          className="btn btn--primary"
        >
          {terminalLoading ? 'Processing...' : 'Terminal Payment'}
        </button>
        {terminalResponse && (
          <JsonViewer
            data={terminalResponse}
            title={terminalResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Vendara Payment */}
      <CommandSection title="Vendara Payment">
        <p className="section-description">
          Initiates a Vendara payment. Leave amount empty to use cart total.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Amount (optional):</label>
            <input
              type="number"
              step="0.01"
              value={vendaraAmount}
              onChange={(e) => setVendaraAmount(e.target.value)}
              placeholder="Leave empty for cart total"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setVendaraResponse('Error: Not running in iframe');
              return;
            }
            setVendaraLoading(true);
            setVendaraResponse('');
            try {
              const result = await command.vendaraPayment(vendaraAmount ? { amount: parseFloat(vendaraAmount) } : undefined);
              setVendaraResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setVendaraResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setVendaraLoading(false);
            }
          }}
          disabled={vendaraLoading}
          className="btn btn--primary"
        >
          {vendaraLoading ? 'Processing...' : 'Vendara Payment'}
        </button>
        {vendaraResponse && (
          <JsonViewer
            data={vendaraResponse}
            title={vendaraResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Redeem payment (extension gift card, etc.) */}
      <CommandSection title="Redeem payment">
        <p className="section-description">
          Calls <code>redeemPayment</code> — same as extension SDK; Render host completes checkout with{' '}
          <code>paymentType: &quot;redeem&quot;</code>. Requires cart with items when embedded in Render.{' '}
          <code>amount</code> is required (in minor units; e.g. <code>500</code> = $5.00). If the amount is less than
          the cart balance, the host requires the cart to be in split-payment mode already.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Amount (required, minor units):</label>
            <input
              type="number"
              step="1"
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(e.target.value)}
              placeholder="e.g. 500 for $5.00"
            />
          </div>
          <div className="form-field">
            <label>Processor (optional):</label>
            <input
              type="text"
              value={redeemProcessor}
              onChange={(e) => setRedeemProcessor(e.target.value)}
              placeholder="giftCard"
            />
          </div>
          <div className="form-field">
            <label>Label (optional):</label>
            <input type="text" value={redeemLabel} onChange={(e) => setRedeemLabel(e.target.value)} placeholder="Gift Card ****" />
          </div>
          <div className="form-field">
            <label>Extension ID (optional):</label>
            <input
              type="text"
              value={redeemExtensionId}
              onChange={(e) => setRedeemExtensionId(e.target.value)}
              placeholder="giftcard-ext"
            />
          </div>
          <div className="form-field">
            <label>Reference ID (optional):</label>
            <input
              type="text"
              value={redeemReferenceId}
              onChange={(e) => setRedeemReferenceId(e.target.value)}
              placeholder="provider reference"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!redeemAmount) {
              setRedeemResponse('Error: amount is required');
              return;
            }
            setRedeemLoading(true);
            setRedeemResponse('');
            try {
              const params: RedeemPaymentParams = { amount: parseFloat(redeemAmount) };
              if (redeemProcessor.trim()) params.processor = redeemProcessor.trim();
              if (redeemLabel.trim()) params.label = redeemLabel.trim();
              if (redeemExtensionId.trim()) params.extensionId = redeemExtensionId.trim();
              if (redeemReferenceId.trim()) params.referenceId = redeemReferenceId.trim();

              const result = await command.redeemPayment(params);
              setRedeemResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setRedeemResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setRedeemLoading(false);
            }
          }}
          disabled={redeemLoading}
          className="btn btn--success"
        >
          {redeemLoading ? 'Processing...' : 'Redeem payment'}
        </button>
        {redeemResponse && (
          <JsonViewer
            data={redeemResponse}
            title={redeemResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Integration payment (Stripe-like) */}
      <CommandSection title="Integration payment">
        <p className="section-description">
          Calls <code>integrationPayment</code> — for Stripe-style integrations. The extension processes the payment
          with its own provider, then reports back so Render records the transaction + order. Wire{' '}
          <code>paymentType: &quot;integration&quot;</code>. Required: <code>amount</code> (minor units) and{' '}
          <code>emvData</code> (typed object — host maps camelCase keys to canonical EMV keys and JSON-serializes onto
          the order&apos;s <code>paymentMethod.emv</code>). If the amount is less than the cart balance, the host requires
          split-payment mode to be active.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Amount (required, minor units):</label>
            <input
              type="number"
              step="1"
              value={integrationAmount}
              onChange={(e) => setIntegrationAmount(e.target.value)}
              placeholder="e.g. 4250 for $42.50"
            />
          </div>
          <div className="form-field">
            <label>EMV — Brand:</label>
            <input
              type="text"
              value={integrationEmvBrand}
              onChange={(e) => setIntegrationEmvBrand(e.target.value)}
              placeholder="Visa"
            />
          </div>
          <div className="form-field">
            <label>EMV — Card last 4 (required for display):</label>
            <input
              type="text"
              maxLength={4}
              value={integrationEmvLast4}
              onChange={(e) => setIntegrationEmvLast4(e.target.value)}
              placeholder="4242"
            />
          </div>
          <div className="form-field">
            <label>EMV — Cardholder name (optional):</label>
            <input
              type="text"
              value={integrationEmvCardholder}
              onChange={(e) => setIntegrationEmvCardholder(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div className="form-field">
            <label>EMV — Expiry (optional):</label>
            <input
              type="text"
              value={integrationEmvExpiry}
              onChange={(e) => setIntegrationEmvExpiry(e.target.value)}
              placeholder="12/26"
            />
          </div>
          <div className="form-field">
            <label>EMV — Country (optional):</label>
            <input
              type="text"
              value={integrationEmvCountry}
              onChange={(e) => setIntegrationEmvCountry(e.target.value)}
              placeholder="US"
            />
          </div>
          <div className="form-field">
            <label>EMV — Issuer (optional):</label>
            <input
              type="text"
              value={integrationEmvIssuer}
              onChange={(e) => setIntegrationEmvIssuer(e.target.value)}
              placeholder="Chase"
            />
          </div>
          <div className="form-field">
            <label>Processor (optional):</label>
            <input
              type="text"
              value={integrationProcessor}
              onChange={(e) => setIntegrationProcessor(e.target.value)}
              placeholder="Stripe"
            />
          </div>
          <div className="form-field">
            <label>Label (optional):</label>
            <input
              type="text"
              value={integrationLabel}
              onChange={(e) => setIntegrationLabel(e.target.value)}
              placeholder="Visa ****4242"
            />
          </div>
          <div className="form-field">
            <label>Extension ID (optional):</label>
            <input
              type="text"
              value={integrationExtensionId}
              onChange={(e) => setIntegrationExtensionId(e.target.value)}
              placeholder="stripe-ext"
            />
          </div>
          <div className="form-field">
            <label>Reference ID (optional):</label>
            <input
              type="text"
              value={integrationReferenceId}
              onChange={(e) => setIntegrationReferenceId(e.target.value)}
              placeholder="provider payment intent / charge id"
            />
          </div>
          <div className="form-field">
            <label>Processor Fee (optional, minor units):</label>
            <input
              type="number"
              step="1"
              value={integrationProcessorFee}
              onChange={(e) => setIntegrationProcessorFee(e.target.value)}
              placeholder="e.g. 125 for $1.25"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!integrationAmount) {
              setIntegrationResponse('Error: amount is required');
              return;
            }
            setIntegrationLoading(true);
            setIntegrationResponse('');
            try {
              const emvData: IntegrationEmvData = {};
              if (integrationEmvBrand.trim()) emvData.brand = integrationEmvBrand.trim();
              if (integrationEmvLast4.trim()) emvData.cardNumberLast4 = integrationEmvLast4.trim();
              if (integrationEmvCardholder.trim()) emvData.cardholderName = integrationEmvCardholder.trim();
              if (integrationEmvExpiry.trim()) emvData.expiryDate = integrationEmvExpiry.trim();
              if (integrationEmvCountry.trim()) emvData.country = integrationEmvCountry.trim();
              if (integrationEmvIssuer.trim()) emvData.issuer = integrationEmvIssuer.trim();

              const params: IntegrationPaymentParams = {
                amount: parseFloat(integrationAmount),
                emvData
              };
              if (integrationProcessor.trim()) params.processor = integrationProcessor.trim();
              if (integrationLabel.trim()) params.label = integrationLabel.trim();
              if (integrationExtensionId.trim()) params.extensionId = integrationExtensionId.trim();
              if (integrationReferenceId.trim()) params.referenceId = integrationReferenceId.trim();
              if (integrationProcessorFee) params.processorFee = parseFloat(integrationProcessorFee);

              const result = await command.integrationPayment(params);
              setIntegrationResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setIntegrationResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setIntegrationLoading(false);
            }
          }}
          disabled={integrationLoading}
          className="btn btn--success"
        >
          {integrationLoading ? 'Processing...' : 'Integration payment'}
        </button>
        {integrationResponse && (
          <JsonViewer
            data={integrationResponse}
            title={integrationResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Extension payment (generic wire action) */}
      <CommandSection title="Extension payment (generic)">
        <p className="section-description">
          Calls <code>extensionPayment</code> with a <code>paymentType</code>. For <code>redeem</code>, behavior matches
          Redeem payment above. Other types will error until the host implements them.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>paymentType:</label>
            <input
              type="text"
              value={extPaymentType}
              onChange={(e) => setExtPaymentType(e.target.value)}
              placeholder="redeem"
            />
          </div>
          <div className="form-field">
            <label>Amount (optional):</label>
            <input
              type="number"
              step="0.01"
              value={extAmount}
              onChange={(e) => setExtAmount(e.target.value)}
              placeholder="Leave empty for cart total"
            />
          </div>
          <div className="form-field">
            <label>Processor (optional):</label>
            <input type="text" value={extProcessor} onChange={(e) => setExtProcessor(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Label (optional):</label>
            <input type="text" value={extLabel} onChange={(e) => setExtLabel(e.target.value)} />
          </div>
        </div>
        <button
          onClick={async () => {
            setExtLoading(true);
            setExtResponse('');
            try {
              const paymentType = extPaymentType.trim() || 'redeem';
              const params: ExtensionPaymentParams = { paymentType };
              if (extAmount) params.amount = parseFloat(extAmount);
              if (extProcessor.trim()) params.processor = extProcessor.trim();
              if (extLabel.trim()) params.label = extLabel.trim();

              const result = await command.extensionPayment(params);
              setExtResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setExtResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setExtLoading(false);
            }
          }}
          disabled={extLoading}
          className="btn btn--primary"
        >
          {extLoading ? 'Processing...' : 'Extension payment'}
        </button>
        {extResponse && (
          <JsonViewer data={extResponse} title={extResponse.startsWith('Error') ? 'Error' : 'Success'} />
        )}
      </CommandSection>

      {/* Partial Payment */}
      <CommandSection title="Partial Payment">
        <p className="section-description">
          Initiates a partial/split payment. Can open UI or process with specified amount.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={partialPaymentOpenUI}
                onChange={(e) => setPartialPaymentOpenUI(e.target.checked)}
              />
              <span>Open UI (ignore amount fields)</span>
            </label>
          </div>
          {!partialPaymentOpenUI && (
            <>
              <div className="form-field">
                <label>Amount:</label>
                <input
                  type="number"
                  step="0.01"
                  value={partialPaymentAmount}
                  onChange={(e) => setPartialPaymentAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="form-field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={partialPaymentIsPercent}
                    onChange={(e) => setPartialPaymentIsPercent(e.target.checked)}
                  />
                  <span>Is Percentage</span>
                </label>
              </div>
            </>
          )}
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setPartialPaymentResponse('Error: Not running in iframe');
              return;
            }
            if (!partialPaymentOpenUI && !partialPaymentAmount) {
              setPartialPaymentResponse('Error: Amount is required when not using UI');
              return;
            }
            setPartialPaymentLoading(true);
            setPartialPaymentResponse('');
            try {
              const result = await command.partialPayment(
                partialPaymentOpenUI
                  ? { openUI: true }
                  : {
                      amount: parseFloat(partialPaymentAmount) || 0,
                      isPercent: partialPaymentIsPercent
                    }
              );
              setPartialPaymentResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setPartialPaymentResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setPartialPaymentLoading(false);
            }
          }}
          disabled={partialPaymentLoading}
          className="btn btn--primary"
        >
          {partialPaymentLoading ? 'Processing...' : 'Partial Payment'}
        </button>
        {partialPaymentResponse && (
          <JsonViewer
            data={partialPaymentResponse}
            title={partialPaymentResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>
    </div>
  );
}

