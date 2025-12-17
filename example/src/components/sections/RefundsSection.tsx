import { useState } from 'react';
import { command } from '@final-commerce/command-frame';
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
  const [processRefundLoading, setProcessRefundLoading] = useState(false);
  const [processRefundResponse, setProcessRefundResponse] = useState<string>('');

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

      {/* Get Refunds */}
      <CommandSection title="Get Refunds">
        <p className="section-description">
          Retrieves a list of refunds with optional filtering and pagination.
        </p>
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
          <JsonViewer
            data={getRefundsResponse}
            title={getRefundsResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Set Refund Stock Action">
        <p className="section-description">
          Sets the stock handling option for a refunded item (restock or mark as damaged). Use the <code>key</code> field from the <code>getLineItemsByOrder</code> response (or <code>internalId</code>/<code>variantId</code>).
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
            <select
              value={stockAction}
              onChange={(e) => setStockAction(e.target.value as 'RESTOCK' | 'REFUND_DAMAGE')}
            >
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
                action: stockAction
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
        <p className="section-description">
          Selects all remaining refundable items for a full refund.
        </p>
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
          <JsonViewer
            data={selectAllResponse}
            title={selectAllResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Reset Refund Details */}
      <CommandSection title="Reset Refund Details">
        <p className="section-description">
          Clears all refund selections.
        </p>
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
        <p className="section-description">
          Calculates and previews the refund total based on current selections.
        </p>
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
          Processes the refund with current selections. Make sure to set items to refund first.
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
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setProcessRefundResponse('Error: Not running in iframe');
              return;
            }
            setProcessRefundLoading(true);
            setProcessRefundResponse('');
            try {
              const result = await command.processPartialRefund(refundReason ? { reason: refundReason } : undefined);
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
    </div>
  );
}

