import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import type { GetRefundPlanResponse, ProcessPartialRefundParams } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface RefundsSectionProps {
  isInIframe: boolean;
}

export function RefundsSection({ isInIframe }: RefundsSectionProps) {
  // Initiate Refund
  const [refundOrderId, setRefundOrderId] = useState<string>('');
  const [initiateRefundLoading, setInitiateRefundLoading] = useState(false);
  const [initiateRefundResponse, setInitiateRefundResponse] = useState<string>('');

  const [activeRefundOrderId, setActiveRefundOrderId] = useState<string>('');
  const [setActiveRefundLoading, setSetActiveRefundLoading] = useState(false);
  const [setActiveRefundResponse, setSetActiveRefundResponse] = useState<string>('');

  // Get Refunds
  const [refundsOrderId, setRefundsOrderId] = useState<string>('');
  const [refundsLimit, setRefundsLimit] = useState<string>('10');
  const [getRefundsLoading, setGetRefundsLoading] = useState(false);
  const [getRefundsResponse, setGetRefundsResponse] = useState<string>('');

  // Get Line Items By Order
  // const [lineItemsOrderId, setLineItemsOrderId] = useState<string>('');
  // const [getLineItemsLoading, setGetLineItemsLoading] = useState(false);
  // const [getLineItemsResponse, setGetLineItemsResponse] = useState<string>('');

  // Set Refund Stock Action
  const [stockActionItemKey, setStockActionItemKey] = useState<string>('');
  const [stockAction, setStockAction] = useState<'RESTOCK' | 'REFUND_DAMAGE'>('RESTOCK');
  const [setStockActionLoading, setSetStockActionLoading] = useState(false);
  const [setStockActionResponse, setSetStockActionResponse] = useState<string>('');

  // Select All / Reset / Calculate / Get Remaining
  const [selectAllLoading, setSelectAllLoading] = useState(false);
  const [selectAllResponse, setSelectAllResponse] = useState<string>('');
  const [resetRefundLoading, setResetRefundLoading] = useState(false);
  const [resetRefundResponse, setResetRefundResponse] = useState<string>('');
  const [calculateRefundLoading, setCalculateRefundLoading] = useState(false);
  const [calculateRefundResponse, setCalculateRefundResponse] = useState<string>('');
  const [getRemainingLoading, setGetRemainingLoading] = useState(false);
  const [getRemainingResponse, setGetRemainingResponse] = useState<string>('');

  // Process Partial Refund
  const [refundReason, setRefundReason] = useState<string>('');
  const [processRefundOpenUI, setProcessRefundOpenUI] = useState<boolean>(true);
  const [processRefundLegsJson, setProcessRefundLegsJson] = useState<string>('');
  const [processRefundLoading, setProcessRefundLoading] = useState(false);
  const [processRefundResponse, setProcessRefundResponse] = useState<string>('');

  // Get Refund Plan
  const [refundPlanOrderId, setRefundPlanOrderId] = useState<string>('');
  const [getRefundPlanLoading, setGetRefundPlanLoading] = useState(false);
  const [getRefundPlanResponse, setGetRefundPlanResponse] = useState<GetRefundPlanResponse | null>(null);
  const [getRefundPlanError, setGetRefundPlanError] = useState<string>('');

  // Redeem Refund
  const [redeemOrderId, setRedeemOrderId] = useState<string>('');
  const [redeemAmount, setRedeemAmount] = useState<string>('');
  const [redeemReferenceId, setRedeemReferenceId] = useState<string>('');
  const [redeemProcessor, setRedeemProcessor] = useState<string>('giftCard');
  const [redeemReason, setRedeemReason] = useState<string>('');
  const [redeemRefundLoading, setRedeemRefundLoading] = useState(false);
  const [redeemRefundResponse, setRedeemRefundResponse] = useState<string>('');

  return (
    <div className="section-content">
      {/* Initiate Refund */}
      <CommandSection title="Initiate Refund">
        <p className="section-description">
          Initiates a refund process for an order. Opens the refund UI in the parent application.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Order ID (optional):</label>
            <input
              type="text"
              value={refundOrderId}
              onChange={(e) => setRefundOrderId(e.target.value)}
              placeholder="Leave empty to use active order"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setInitiateRefundResponse('Error: Not running in iframe');
              return;
            }
            setInitiateRefundLoading(true);
            setInitiateRefundResponse('');
            try {
              const result = await command.initiateRefund(refundOrderId ? { orderId: refundOrderId } : undefined);
              setInitiateRefundResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setInitiateRefundResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setInitiateRefundLoading(false);
            }
          }}
          disabled={initiateRefundLoading}
          className="btn btn--warning"
        >
          {initiateRefundLoading ? 'Processing...' : 'Initiate Refund'}
        </button>
        {initiateRefundResponse && (
          <JsonViewer
            data={initiateRefundResponse}
            title={initiateRefundResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Set Active Refund">
        <p className="section-description">
          Loads an order by id and opens the refund flow with initial selection state.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Order ID:</label>
            <input
              type="text"
              value={activeRefundOrderId}
              onChange={(e) => setActiveRefundOrderId(e.target.value)}
              placeholder="order-id"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setSetActiveRefundResponse('Error: Not running in iframe');
              return;
            }
            if (!activeRefundOrderId) {
              setSetActiveRefundResponse('Error: Please enter an order ID');
              return;
            }
            setSetActiveRefundLoading(true);
            setSetActiveRefundResponse('');
            try {
              const result = await command.setActiveRefund({ orderId: activeRefundOrderId });
              setSetActiveRefundResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setSetActiveRefundResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setSetActiveRefundLoading(false);
            }
          }}
          disabled={setActiveRefundLoading}
          className="btn btn--primary"
        >
          {setActiveRefundLoading ? 'Setting...' : 'Set Active Refund'}
        </button>
        {setActiveRefundResponse && (
          <JsonViewer
            data={setActiveRefundResponse}
            title={setActiveRefundResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Get Refunds */}
      <CommandSection title="Get Refunds">
        <p className="section-description">Retrieves a list of refunds with optional filtering and pagination.</p>
        <div className="form-group">
          <div className="form-field">
            <label>Order ID (optional):</label>
            <input
              type="text"
              value={refundsOrderId}
              onChange={(e) => setRefundsOrderId(e.target.value)}
              placeholder="order-id-123"
            />
          </div>
          <div className="form-field">
            <label>Limit:</label>
            <input
              type="number"
              value={refundsLimit}
              onChange={(e) => setRefundsLimit(e.target.value)}
              placeholder="10"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setGetRefundsResponse('Error: Not running in iframe');
              return;
            }
            setGetRefundsLoading(true);
            setGetRefundsResponse('');
            try {
              const params: any = { limit: parseInt(refundsLimit) || 10 };
              if (refundsOrderId) params.orderId = refundsOrderId;

              const result = await command.getRefunds(params);
              setGetRefundsResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setGetRefundsResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setGetRefundsLoading(false);
            }
          }}
          disabled={getRefundsLoading}
          className="btn btn--primary"
        >
          {getRefundsLoading ? 'Loading...' : 'Get Refunds'}
        </button>
        {getRefundsResponse && (
          <JsonViewer data={getRefundsResponse} title={getRefundsResponse.startsWith('Error') ? 'Error' : 'Success'} />
        )}
      </CommandSection>

      <CommandSection title="Set Refund Stock Action">
        <p className="section-description">
          Sets the stock handling option for a refunded item (restock or mark as damaged). Use the <code>key</code>{' '}
          field from the <code>getLineItemsByOrder</code> response (or <code>internalId</code>/<code>variantId</code>).
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Item Key (from getLineItemsByOrder):</label>
            <input
              type="text"
              value={stockActionItemKey}
              onChange={(e) => setStockActionItemKey(e.target.value)}
              placeholder="Use 'key' field from lineItems"
            />
          </div>
          <div className="form-field">
            <label>Action:</label>
            <select value={stockAction} onChange={(e) => setStockAction(e.target.value as 'RESTOCK' | 'REFUND_DAMAGE')}>
              <option value="RESTOCK">Return to Stock</option>
              <option value="REFUND_DAMAGE">Mark as Damaged</option>
            </select>
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setSetStockActionResponse('Error: Not running in iframe');
              return;
            }
            if (!stockActionItemKey) {
              setSetStockActionResponse('Error: Item key is required');
              return;
            }
            setSetStockActionLoading(true);
            setSetStockActionResponse('');
            try {
              const result = await command.setRefundStockAction({
                itemKey: stockActionItemKey,
                action: stockAction,
              });
              setSetStockActionResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setSetStockActionResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setSetStockActionLoading(false);
            }
          }}
          disabled={setStockActionLoading}
          className="btn btn--primary"
        >
          {setStockActionLoading ? 'Setting...' : 'Set Stock Action'}
        </button>
        {setStockActionResponse && (
          <JsonViewer
            data={setStockActionResponse}
            title={setStockActionResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Select All Refund Items */}
      <CommandSection title="Select All Refund Items">
        <p className="section-description">Selects all remaining refundable items for a full refund.</p>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setSelectAllResponse('Error: Not running in iframe');
              return;
            }
            setSelectAllLoading(true);
            setSelectAllResponse('');
            try {
              const result = await command.selectAllRefundItems();
              setSelectAllResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setSelectAllResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setSelectAllLoading(false);
            }
          }}
          disabled={selectAllLoading}
          className="btn btn--primary"
        >
          {selectAllLoading ? 'Selecting...' : 'Select All Items'}
        </button>
        {selectAllResponse && (
          <JsonViewer data={selectAllResponse} title={selectAllResponse.startsWith('Error') ? 'Error' : 'Success'} />
        )}
      </CommandSection>

      {/* Reset Refund Details */}
      <CommandSection title="Reset Refund Details">
        <p className="section-description">Clears all refund selections.</p>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setResetRefundResponse('Error: Not running in iframe');
              return;
            }
            setResetRefundLoading(true);
            setResetRefundResponse('');
            try {
              const result = await command.resetRefundDetails();
              setResetRefundResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setResetRefundResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setResetRefundLoading(false);
            }
          }}
          disabled={resetRefundLoading}
          className="btn btn--danger"
        >
          {resetRefundLoading ? 'Resetting...' : 'Reset Refund Details'}
        </button>
        {resetRefundResponse && (
          <JsonViewer
            data={resetRefundResponse}
            title={resetRefundResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Calculate Refund Total */}
      <CommandSection title="Calculate Refund Total">
        <p className="section-description">Calculates and previews the refund total based on current selections.</p>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setCalculateRefundResponse('Error: Not running in iframe');
              return;
            }
            setCalculateRefundLoading(true);
            setCalculateRefundResponse('');
            try {
              const result = await command.calculateRefundTotal();
              setCalculateRefundResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setCalculateRefundResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setCalculateRefundLoading(false);
            }
          }}
          disabled={calculateRefundLoading}
          className="btn btn--primary"
        >
          {calculateRefundLoading ? 'Calculating...' : 'Calculate Refund Total'}
        </button>
        {calculateRefundResponse && (
          <JsonViewer
            data={calculateRefundResponse}
            title={calculateRefundResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Get Remaining Refundable Quantities */}
      <CommandSection title="Get Remaining Refundable Quantities">
        <p className="section-description">
          Gets the remaining refundable quantities for all items in the active order.
        </p>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setGetRemainingResponse('Error: Not running in iframe');
              return;
            }
            setGetRemainingLoading(true);
            setGetRemainingResponse('');
            try {
              const result = await command.getRemainingRefundableQuantities();
              setGetRemainingResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setGetRemainingResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setGetRemainingLoading(false);
            }
          }}
          disabled={getRemainingLoading}
          className="btn btn--primary"
        >
          {getRemainingLoading ? 'Loading...' : 'Get Remaining Quantities'}
        </button>
        {getRemainingResponse && (
          <JsonViewer
            data={getRemainingResponse}
            title={getRemainingResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Process Partial Refund */}
      <CommandSection title="Process Partial Refund">
        <p className="section-description">
          Processes the refund with current selections. Make sure to set items to refund first. On a multi-tender order,
          uncheck "Open split-payment UI" to commit headlessly — either against the planner's default proportional
          allocation, or against an explicit <code>legs</code> allocation (JSON below; per-tender amount in minor units,
          with an optional <code>giftCard</code> destination for mixed returns).
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Reason (optional):</label>
            <input
              type="text"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Refund reason"
            />
          </div>
          <div className="form-field">
            <label>
              <input
                type="checkbox"
                checked={processRefundOpenUI}
                onChange={(e) => setProcessRefundOpenUI(e.target.checked)}
              />{' '}
              Open split-payment UI (openUI) — uncheck for headless multi-tender commit
            </label>
          </div>
          <div className="form-field">
            <label>Legs (optional, JSON array — requires openUI unchecked):</label>
            <textarea
              value={processRefundLegsJson}
              onChange={(e) => setProcessRefundLegsJson(e.target.value)}
              placeholder={
                '[\n  { "transactionId": "cash-txn-id", "amount": 700 },\n  { "transactionId": "card-txn-id", "amount": 800, "giftCard": { "referenceId": "GC1" } }\n]'
              }
              rows={5}
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setProcessRefundResponse('Error: Not running in iframe');
              return;
            }
            let legs: ProcessPartialRefundParams['legs'];
            if (processRefundLegsJson.trim()) {
              try {
                legs = JSON.parse(processRefundLegsJson) as ProcessPartialRefundParams['legs'];
              } catch {
                setProcessRefundResponse('Error: Legs is not valid JSON');
                return;
              }
            }
            setProcessRefundLoading(true);
            setProcessRefundResponse('');
            try {
              const result = await command.processPartialRefund({
                ...(refundReason ? { reason: refundReason } : {}),
                openUI: processRefundOpenUI,
                ...(legs ? { legs } : {}),
              });
              setProcessRefundResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setProcessRefundResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setProcessRefundLoading(false);
            }
          }}
          disabled={processRefundLoading}
          className="btn btn--warning"
        >
          {processRefundLoading ? 'Processing...' : 'Process Partial Refund'}
        </button>
        {processRefundResponse && (
          <JsonViewer
            data={processRefundResponse}
            title={processRefundResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Get Refund Plan */}
      <CommandSection title="Get Refund Plan">
        <p className="section-description">
          Read-only: queries the refund engine's own per-source and order-level capacity for an order. Use this to
          prefill refund UI (e.g. <code>legs</code> for Process Partial Refund, or <code>redeemRefund</code>'s same-card
          refund) instead of recomputing capacity client-side — the numbers are an advisory snapshot, so the mutating
          commands still re-validate at commit time.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Order ID (optional):</label>
            <input
              type="text"
              value={refundPlanOrderId}
              onChange={(e) => setRefundPlanOrderId(e.target.value)}
              placeholder="Leave empty to use active order"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setGetRefundPlanError('Error: Not running in iframe');
              setGetRefundPlanResponse(null);
              return;
            }
            setGetRefundPlanLoading(true);
            setGetRefundPlanError('');
            setGetRefundPlanResponse(null);
            try {
              const result = await command.getRefundPlan(
                refundPlanOrderId ? { orderId: refundPlanOrderId } : undefined,
              );
              setGetRefundPlanResponse(result);
            } catch (error) {
              setGetRefundPlanError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setGetRefundPlanLoading(false);
            }
          }}
          disabled={getRefundPlanLoading}
          className="btn btn--primary"
        >
          {getRefundPlanLoading ? 'Loading...' : 'Get Refund Plan'}
        </button>
        {getRefundPlanError && <JsonViewer data={getRefundPlanError} title="Error" />}
        {getRefundPlanResponse && (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Type</th>
                  <th>Processor</th>
                  <th>Captured</th>
                  <th>Refunded</th>
                  <th>Max Refundable</th>
                  <th>Refundable To Source</th>
                  <th>Card Number</th>
                </tr>
              </thead>
              <tbody>
                {getRefundPlanResponse.sources.map((source) => (
                  <tr key={source.transactionId}>
                    <td>{source.transactionId}</td>
                    <td>{source.paymentType}</td>
                    <td>{source.processor ?? ''}</td>
                    <td className="text-right">{source.capturedAmount}</td>
                    <td className="text-right">{source.refundedAmount}</td>
                    <td className="text-right">{source.maxRefundable}</td>
                    <td>{source.refundableToSource ? 'yes' : 'no'}</td>
                    <td>{source.cardNumber ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="data-table-footer">
              <strong>Remaining refundable: {getRefundPlanResponse.remainingRefundable}</strong>
              {' · '}
              Non-refundable liability: {getRefundPlanResponse.nonRefundableLiability}
              {' · '}
              Total captured: {getRefundPlanResponse.totalCaptured}
              {' · '}
              Total refunded: {getRefundPlanResponse.totalRefunded}
            </div>
          </div>
        )}
      </CommandSection>

      {/* Redeem Refund */}
      <CommandSection title="Redeem Refund">
        <p className="section-description">
          Records a refund onto a gift-card/redeem tender (credit-first contract), drawing from the order's remaining
          refundable capacity across all source payments.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Order ID (optional):</label>
            <input
              type="text"
              value={redeemOrderId}
              onChange={(e) => setRedeemOrderId(e.target.value)}
              placeholder="Leave empty to use active order"
            />
          </div>
          <div className="form-field">
            <label>Amount (minor units):</label>
            <input
              type="number"
              value={redeemAmount}
              onChange={(e) => setRedeemAmount(e.target.value)}
              placeholder="1575 = $15.75"
            />
          </div>
          <div className="form-field">
            <label>Reference ID (card number):</label>
            <input
              type="text"
              value={redeemReferenceId}
              onChange={(e) => setRedeemReferenceId(e.target.value)}
              placeholder="gift-card-number"
            />
          </div>
          <div className="form-field">
            <label>Processor:</label>
            <input
              type="text"
              value={redeemProcessor}
              onChange={(e) => setRedeemProcessor(e.target.value)}
              placeholder="giftCard"
            />
          </div>
          <div className="form-field">
            <label>Reason (optional):</label>
            <input
              type="text"
              value={redeemReason}
              onChange={(e) => setRedeemReason(e.target.value)}
              placeholder="Refund reason"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setRedeemRefundResponse('Error: Not running in iframe');
              return;
            }
            const amount = parseInt(redeemAmount, 10);
            if (!amount || amount <= 0) {
              setRedeemRefundResponse('Error: Amount must be greater than 0');
              return;
            }
            if (!redeemReferenceId) {
              setRedeemRefundResponse('Error: Reference ID is required');
              return;
            }
            setRedeemRefundLoading(true);
            setRedeemRefundResponse('');
            try {
              const params: {
                orderId?: string;
                amount: number;
                referenceId: string;
                processor?: string;
                reason?: string;
              } = {
                amount,
                referenceId: redeemReferenceId,
              };
              if (redeemOrderId) params.orderId = redeemOrderId;
              if (redeemProcessor) params.processor = redeemProcessor;
              if (redeemReason) params.reason = redeemReason;
              const result = await command.redeemRefund(params);
              setRedeemRefundResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setRedeemRefundResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setRedeemRefundLoading(false);
            }
          }}
          disabled={redeemRefundLoading}
          className="btn btn--warning"
        >
          {redeemRefundLoading ? 'Processing...' : 'Redeem Refund'}
        </button>
        {redeemRefundResponse && (
          <JsonViewer
            data={redeemRefundResponse}
            title={redeemRefundResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>
    </div>
  );
}
