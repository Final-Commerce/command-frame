import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface OrdersSectionProps {
  isInIframe: boolean;
}

export function OrdersSection({ isInIframe }: OrdersSectionProps) {
  // Park Order
  const [parkOrderLoading, setParkOrderLoading] = useState(false);
  const [parkOrderResponse, setParkOrderResponse] = useState<string>('');

  // Resume Parked Order
  const [resumeOrderId, setResumeOrderId] = useState<string>('');
  const [resumeParkedOrderLoading, setResumeParkedOrderLoading] = useState(false);
  const [resumeParkedOrderResponse, setResumeParkedOrderResponse] = useState<string>('');

  // Delete Parked Order
  const [deleteOrderId, setDeleteOrderId] = useState<string>('');
  const [deleteParkedOrderLoading, setDeleteParkedOrderLoading] = useState(false);
  const [deleteParkedOrderResponse, setDeleteParkedOrderResponse] = useState<string>('');


  // Get Orders
  const [ordersStatus, setOrdersStatus] = useState<string>('');
  const [ordersCustomerId, setOrdersCustomerId] = useState<string>('');
  const [ordersLimit, setOrdersLimit] = useState<string>('10');
  const [getOrdersLoading, setGetOrdersLoading] = useState(false);
  const [getOrdersResponse, setGetOrdersResponse] = useState<string>('');

  return (
    <div className="section-content">
      {/* Park Order */}
      <CommandSection title="Park Order">
        <p className="section-description">
          Parks (saves) the current order for later retrieval. The cart is cleared after parking.
        </p>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setParkOrderResponse('Error: Not running in iframe');
              return;
            }
            setParkOrderLoading(true);
            setParkOrderResponse('');
            try {
              const result = await command.parkOrder();
              setParkOrderResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setParkOrderResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setParkOrderLoading(false);
            }
          }}
          disabled={parkOrderLoading}
          className="btn btn--primary"
        >
          {parkOrderLoading ? 'Parking...' : 'Park Order'}
        </button>
        {parkOrderResponse && (
          <JsonViewer
            data={parkOrderResponse}
            title={parkOrderResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Resume Parked Order */}
      <CommandSection title="Resume Parked Order">
        <p className="section-description">
          Resumes a previously parked order by loading it back into the cart.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Order ID:</label>
            <input
              type="text"
              value={resumeOrderId}
              onChange={(e) => setResumeOrderId(e.target.value)}
              placeholder="parked-order-id"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setResumeParkedOrderResponse('Error: Not running in iframe');
              return;
            }
            if (!resumeOrderId) {
              setResumeParkedOrderResponse('Error: Please enter an order ID');
              return;
            }
            setResumeParkedOrderLoading(true);
            setResumeParkedOrderResponse('');
            try {
              const result = await command.resumeParkedOrder({ orderId: resumeOrderId });
              setResumeParkedOrderResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setResumeParkedOrderResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setResumeParkedOrderLoading(false);
            }
          }}
          disabled={resumeParkedOrderLoading}
          className="btn btn--primary"
        >
          {resumeParkedOrderLoading ? 'Resuming...' : 'Resume Parked Order'}
        </button>
        {resumeParkedOrderResponse && (
          <JsonViewer
            data={resumeParkedOrderResponse}
            title={resumeParkedOrderResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Delete Parked Order */}
      <CommandSection title="Delete Parked Order">
        <p className="section-description">
          Deletes a parked order from the system.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Order ID:</label>
            <input
              type="text"
              value={deleteOrderId}
              onChange={(e) => setDeleteOrderId(e.target.value)}
              placeholder="parked-order-id"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setDeleteParkedOrderResponse('Error: Not running in iframe');
              return;
            }
            if (!deleteOrderId) {
              setDeleteParkedOrderResponse('Error: Please enter an order ID');
              return;
            }
            setDeleteParkedOrderLoading(true);
            setDeleteParkedOrderResponse('');
            try {
              const result = await command.deleteParkedOrder({ orderId: deleteOrderId });
              setDeleteParkedOrderResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setDeleteParkedOrderResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setDeleteParkedOrderLoading(false);
            }
          }}
          disabled={deleteParkedOrderLoading}
          className="btn btn--danger"
        >
          {deleteParkedOrderLoading ? 'Deleting...' : 'Delete Parked Order'}
        </button>
        {deleteParkedOrderResponse && (
          <JsonViewer
            data={deleteParkedOrderResponse}
            title={deleteParkedOrderResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>


      {/* Get Orders */}
      <CommandSection title="Get Orders">
        <p className="section-description">
          Retrieves a list of orders with optional filtering and pagination.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Status (optional):</label>
            <select
              value={ordersStatus}
              onChange={(e) => setOrdersStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="completed">Completed</option>
              <option value="parked">Parked</option>
              <option value="refunded">Refunded</option>
              <option value="partial-refund">Partial Refund</option>
            </select>
          </div>
          <div className="form-field">
            <label>Customer ID (optional):</label>
            <input
              type="text"
              value={ordersCustomerId}
              onChange={(e) => setOrdersCustomerId(e.target.value)}
              placeholder="customer-id-123"
            />
          </div>
          <div className="form-field">
            <label>Limit:</label>
            <input
              type="number"
              value={ordersLimit}
              onChange={(e) => setOrdersLimit(e.target.value)}
              placeholder="10"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setGetOrdersResponse('Error: Not running in iframe');
              return;
            }
            setGetOrdersLoading(true);
            setGetOrdersResponse('');
            try {
              const params: any = { limit: parseInt(ordersLimit) || 10 };
              if (ordersStatus) params.status = ordersStatus;
              if (ordersCustomerId) params.customerId = ordersCustomerId;
              
              const result = await command.getOrders(params);
              setGetOrdersResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setGetOrdersResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setGetOrdersLoading(false);
            }
          }}
          disabled={getOrdersLoading}
          className="btn btn--primary"
        >
          {getOrdersLoading ? 'Loading...' : 'Get Orders'}
        </button>
        {getOrdersResponse && (
          <JsonViewer
            data={getOrdersResponse}
            title={getOrdersResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>
    </div>
  );
}

