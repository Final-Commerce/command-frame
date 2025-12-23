import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
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

