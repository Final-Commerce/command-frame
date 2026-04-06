import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface CartSectionProps {
  isInIframe: boolean;
}

export function CartSection({ isInIframe }: CartSectionProps) {
  const [customSaleLabel, setCustomSaleLabel] = useState<string>('Custom Item');
  const [customSalePrice, setCustomSalePrice] = useState<string>('10.00');
  const [applyTaxes, setApplyTaxes] = useState<boolean>(false);
  const [customSaleLoading, setCustomSaleLoading] = useState(false);
  const [customSaleResponse, setCustomSaleResponse] = useState<string>('');

  // Non-revenue line (gift card load / liability) — same wire extensions use
  const [nrId, setNrId] = useState<string>('gc-row-001');
  const [nrAmount, setNrAmount] = useState<string>('25');
  const [nrLabel, setNrLabel] = useState<string>('Gift card load');
  const [nrMetadataJson, setNrMetadataJson] = useState<string>('{"customTableId":"cards","cardName":"Demo"}');
  const [nrLoading, setNrLoading] = useState(false);
  const [nrResponse, setNrResponse] = useState<string>('');
  
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [addToCartResponse, setAddToCartResponse] = useState<string>('');
  const [addToCartQuantity, setAddToCartQuantity] = useState<string>('1');
  const [addToCartVariantId, setAddToCartVariantId] = useState<string>('');
  
  const [cartDiscountAmount, setCartDiscountAmount] = useState<string>('10');
  const [cartDiscountIsPercent, setCartDiscountIsPercent] = useState<boolean>(false);
  const [cartDiscountLabel, setCartDiscountLabel] = useState<string>('Cart Discount');
  const [addCartDiscountLoading, setAddCartDiscountLoading] = useState(false);
  const [addCartDiscountResponse, setAddCartDiscountResponse] = useState<string>('');

  // Remove Cart Discount
  const [removeCartDiscountLoading, setRemoveCartDiscountLoading] = useState(false);
  const [removeCartDiscountResponse, setRemoveCartDiscountResponse] = useState<string>('');

  // Order Note
  const [orderNote, setOrderNote] = useState<string>('');
  const [addOrderNoteLoading, setAddOrderNoteLoading] = useState(false);
  const [addOrderNoteResponse, setAddOrderNoteResponse] = useState<string>('');

  // Cart Fee
  const [cartFeeAmount, setCartFeeAmount] = useState<string>('5.00');
  const [cartFeeIsPercent, setCartFeeIsPercent] = useState<boolean>(false);
  const [cartFeeLabel, setCartFeeLabel] = useState<string>('Service Fee');
  const [cartFeeApplyTaxes, setCartFeeApplyTaxes] = useState<boolean>(false);
  const [addCartFeeLoading, setAddCartFeeLoading] = useState(false);
  const [addCartFeeResponse, setAddCartFeeResponse] = useState<string>('');

  // Clear Cart
  const [clearCartLoading, setClearCartLoading] = useState(false);
  const [clearCartResponse, setClearCartResponse] = useState<string>('');

  // Get Current Cart
  const [getCurrentCartLoading, setGetCurrentCartLoading] = useState(false);
  const [getCurrentCartResponse, setGetCurrentCartResponse] = useState<string>('');

  // Remove Product from Cart
  const [removeProductInternalId, setRemoveProductInternalId] = useState<string>('');
  const [removeProductLoading, setRemoveProductLoading] = useState(false);
  const [removeProductResponse, setRemoveProductResponse] = useState<string>('');

  // Update Cart Item Quantity
  const [updateQuantityInternalId, setUpdateQuantityInternalId] = useState<string>('');
  const [updateQuantityValue, setUpdateQuantityValue] = useState<string>('1');
  const [updateQuantityLoading, setUpdateQuantityLoading] = useState(false);
  const [updateQuantityResponse, setUpdateQuantityResponse] = useState<string>('');

  const handleAddCustomSale = async () => {
    if (!isInIframe) {
      setCustomSaleResponse('Error: Not running in iframe');
      return;
    }

    setCustomSaleLoading(true);
    setCustomSaleResponse('');

    try {
      const result = await command.addCustomSale({
        label: customSaleLabel,
        price: parseFloat(customSalePrice) || 0,
        applyTaxes: applyTaxes,
      });
      
      setCustomSaleResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setCustomSaleResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setCustomSaleLoading(false);
    }
  };

  const handleAddProductToCart = async () => {
    if (!isInIframe) {
      setAddToCartResponse('Error: Not running in iframe');
      return;
    }

    setAddToCartLoading(true);
    setAddToCartResponse('');

    try {
      const quantity = parseFloat(addToCartQuantity) || 1;
      const result = await command.addProductToCart({
        quantity: quantity,
        variantId: addToCartVariantId
      });
      
      setAddToCartResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setAddToCartResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setAddToCartLoading(false);
    }
  };

  const handleAddCartDiscount = async () => {
    if (!isInIframe) {
      setAddCartDiscountResponse('Error: Not running in iframe');
      return;
    }

    if (!cartDiscountAmount) {
      setAddCartDiscountResponse('Error: Please enter a discount amount');
      return;
    }

    setAddCartDiscountLoading(true);
    setAddCartDiscountResponse('');

    try {
      const result = await command.addCartDiscount({
        amount: parseFloat(cartDiscountAmount) || 0,
        isPercent: cartDiscountIsPercent,
        label: cartDiscountLabel
      });
      
      setAddCartDiscountResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setAddCartDiscountResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setAddCartDiscountLoading(false);
    }
  };

  const handleRemoveCartDiscount = async () => {
    if (!isInIframe) {
      setRemoveCartDiscountResponse('Error: Not running in iframe');
      return;
    }

    setRemoveCartDiscountLoading(true);
    setRemoveCartDiscountResponse('');

    try {
      const result = await command.removeCartDiscount();
      setRemoveCartDiscountResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setRemoveCartDiscountResponse(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setRemoveCartDiscountLoading(false);
    }
  };

  return (
    <div className="section-content">
      {/* Add Custom Sale */}
      <CommandSection title="Add Custom Sale">
        <p className="section-description">
          Adds a custom sale item to the cart. This is useful for adding items that aren't in your product catalog.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Label:</label>
            <input
              type="text"
              value={customSaleLabel}
              onChange={(e) => setCustomSaleLabel(e.target.value)}
              placeholder="Item name"
            />
          </div>
          <div className="form-field">
            <label>Price:</label>
            <input
              type="number"
              step="0.01"
              value={customSalePrice}
              onChange={(e) => setCustomSalePrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={applyTaxes}
                onChange={(e) => setApplyTaxes(e.target.checked)}
              />
              <span>Apply Taxes</span>
            </label>
          </div>
        </div>
        <button
          onClick={handleAddCustomSale}
          disabled={customSaleLoading}
          className="btn btn--primary"
        >
          {customSaleLoading ? 'Adding...' : 'Add Custom Sale'}
        </button>
        {customSaleResponse && (
          <JsonViewer
            data={customSaleResponse}
            title={customSaleResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Add non-revenue item (extension → host cart) */}
      <CommandSection title="Add non-revenue item (gift card load)">
        <p className="section-description">
          Calls <code>addNonRevenueItem</code> — same API extensions use to add a liability line (e.g. gift card purchase).
          Cart total updates; complete checkout from the <strong>Payments</strong> tab (e.g. Cash Payment).
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>id (custom table row / unique key):</label>
            <input value={nrId} onChange={(e) => setNrId(e.target.value)} placeholder="e.g. Mongo id or row id" />
          </div>
          <div className="form-field">
            <label>amount:</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={nrAmount}
              onChange={(e) => setNrAmount(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>label (optional):</label>
            <input value={nrLabel} onChange={(e) => setNrLabel(e.target.value)} />
          </div>
          <div className="form-field">
            <label>metadata JSON (optional):</label>
            <textarea
              rows={3}
              value={nrMetadataJson}
              onChange={(e) => setNrMetadataJson(e.target.value)}
              placeholder='{"customTableId":"..."}'
              style={{ width: '100%', fontFamily: 'monospace', fontSize: '12px' }}
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setNrResponse('Error: Not running in iframe');
              return;
            }
            setNrLoading(true);
            setNrResponse('');
            try {
              let metadata: Record<string, unknown> | undefined;
              const trimmed = nrMetadataJson.trim();
              if (trimmed) {
                metadata = JSON.parse(trimmed) as Record<string, unknown>;
              }
              const amount = parseFloat(nrAmount);
              if (!nrId.trim()) throw new Error('id is required');
              if (!Number.isFinite(amount) || amount <= 0) throw new Error('amount must be a positive number');

              const result = await command.addNonRevenueItem({
                id: nrId.trim(),
                amount,
                ...(nrLabel.trim() ? { label: nrLabel.trim() } : {}),
                ...(metadata ? { metadata } : {}),
              });
              setNrResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setNrResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setNrLoading(false);
            }
          }}
          disabled={nrLoading}
          className="btn btn--primary"
        >
          {nrLoading ? 'Adding…' : 'Add non-revenue to cart'}
        </button>
        {nrResponse && (
          <JsonViewer data={nrResponse} title={nrResponse.startsWith('Error') ? 'Error' : 'Success'} />
        )}
      </CommandSection>

      {/* Add Product to Cart */}
      <CommandSection title="Add Product to Cart">
        <p className="section-description">
          Adds a product to the cart. Requires a Variant ID.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Variant ID:</label>
            <input
              type="text"
              value={addToCartVariantId}
              onChange={(e) => setAddToCartVariantId(e.target.value)}
              placeholder="Variant ID"
            />
          </div>
          <div className="form-field">
            <label>Quantity:</label>
            <input
              type="number"
              value={addToCartQuantity}
              onChange={(e) => setAddToCartQuantity(e.target.value)}
              placeholder="1"
            />
          </div>
        </div>
        <button
          onClick={handleAddProductToCart}
          disabled={addToCartLoading}
          className="btn btn--primary"
        >
          {addToCartLoading ? 'Adding...' : 'Add to Cart'}
        </button>
        {addToCartResponse && (
          <JsonViewer
            data={addToCartResponse}
            title={addToCartResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Add Cart Discount */}
      <CommandSection title="Add Cart Discount">
        <p className="section-description">
          Applies a discount to the entire cart.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Amount:</label>
            <input
              type="number"
              value={cartDiscountAmount}
              onChange={(e) => setCartDiscountAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="form-field">
            <label>Label:</label>
            <input
              type="text"
              value={cartDiscountLabel}
              onChange={(e) => setCartDiscountLabel(e.target.value)}
              placeholder="Cart discount label"
            />
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={cartDiscountIsPercent}
                onChange={(e) => setCartDiscountIsPercent(e.target.checked)}
              />
              <span>Is Percentage</span>
            </label>
          </div>
        </div>
        <button
          onClick={handleAddCartDiscount}
          disabled={addCartDiscountLoading}
          className="btn btn--primary"
        >
          {addCartDiscountLoading ? 'Adding...' : 'Add Cart Discount'}
        </button>
        {addCartDiscountResponse && (
          <JsonViewer
            data={addCartDiscountResponse}
            title={addCartDiscountResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Remove Cart Discount */}
      <CommandSection title="Remove Cart Discount">
        <p className="section-description">
          Removes the cart discount
        </p>
        <button
          onClick={handleRemoveCartDiscount}
          disabled={removeCartDiscountLoading}
          className="btn btn--primary"
        >
          {removeCartDiscountLoading ? 'Removing...' : 'Remove Cart Discount'}
        </button>
        {removeCartDiscountResponse && (
          <JsonViewer
            data={removeCartDiscountResponse}
            title={removeCartDiscountResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Add Order Note */}
      <CommandSection title="Add Order Note">
        <p className="section-description">
          Adds a note to the current order/cart.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Note:</label>
            <textarea
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Enter order note..."
              rows={3}
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setAddOrderNoteResponse('Error: Not running in iframe');
              return;
            }
            if (!orderNote) {
              setAddOrderNoteResponse('Error: Please enter a note');
              return;
            }
            setAddOrderNoteLoading(true);
            setAddOrderNoteResponse('');
            try {
              const result = await command.addOrderNote({ note: orderNote });
              setAddOrderNoteResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setAddOrderNoteResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setAddOrderNoteLoading(false);
            }
          }}
          disabled={addOrderNoteLoading}
          className="btn btn--primary"
        >
          {addOrderNoteLoading ? 'Adding...' : 'Add Order Note'}
        </button>
        {addOrderNoteResponse && (
          <JsonViewer
            data={addOrderNoteResponse}
            title={addOrderNoteResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Add Cart Fee */}
      <CommandSection title="Add Cart Fee">
        <p className="section-description">
          Adds a fee to the entire cart (e.g., service fee, delivery fee).
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Amount:</label>
            <input
              type="number"
              step="0.01"
              value={cartFeeAmount}
              onChange={(e) => setCartFeeAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="form-field">
            <label>Label:</label>
            <input
              type="text"
              value={cartFeeLabel}
              onChange={(e) => setCartFeeLabel(e.target.value)}
              placeholder="Fee label"
            />
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={cartFeeIsPercent}
                onChange={(e) => setCartFeeIsPercent(e.target.checked)}
              />
              <span>Is Percentage</span>
            </label>
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={cartFeeApplyTaxes}
                onChange={(e) => setCartFeeApplyTaxes(e.target.checked)}
              />
              <span>Apply Taxes</span>
            </label>
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setAddCartFeeResponse('Error: Not running in iframe');
              return;
            }
            setAddCartFeeLoading(true);
            setAddCartFeeResponse('');
            try {
              const result = await command.addCartFee({
                amount: parseFloat(cartFeeAmount) || 0,
                isPercent: cartFeeIsPercent,
                label: cartFeeLabel,
                applyTaxes: cartFeeApplyTaxes
              });
              setAddCartFeeResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setAddCartFeeResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setAddCartFeeLoading(false);
            }
          }}
          disabled={addCartFeeLoading}
          className="btn btn--primary"
        >
          {addCartFeeLoading ? 'Adding...' : 'Add Cart Fee'}
        </button>
        {addCartFeeResponse && (
          <JsonViewer
            data={addCartFeeResponse}
            title={addCartFeeResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Clear Cart */}
      <CommandSection title="Clear Cart">
        <p className="section-description">
          Clears all items from the current cart.
        </p>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setClearCartResponse('Error: Not running in iframe');
              return;
            }
            setClearCartLoading(true);
            setClearCartResponse('');
            try {
              const result = await command.clearCart();
              setClearCartResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setClearCartResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setClearCartLoading(false);
            }
          }}
          disabled={clearCartLoading}
          className="btn btn--danger"
        >
          {clearCartLoading ? 'Clearing...' : 'Clear Cart'}
        </button>
        {clearCartResponse && (
          <JsonViewer
            data={clearCartResponse}
            title={clearCartResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Get Current Cart */}
      <CommandSection title="Get Current Cart">
        <p className="section-description">
          Retrieves the complete current cart object including products, custom sales, non-revenue lines, totals, discounts, fees, and customer information.
        </p>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setGetCurrentCartResponse('Error: Not running in iframe');
              return;
            }
            setGetCurrentCartLoading(true);
            setGetCurrentCartResponse('');
            try {
              const result = await command.getCurrentCart();
              setGetCurrentCartResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setGetCurrentCartResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setGetCurrentCartLoading(false);
            }
          }}
          disabled={getCurrentCartLoading}
          className="btn btn--primary"
        >
          {getCurrentCartLoading ? 'Loading...' : 'Get Current Cart'}
        </button>
        {getCurrentCartResponse && (
          <JsonViewer
            data={getCurrentCartResponse}
            title={getCurrentCartResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Remove Product from Cart */}
      <CommandSection title="Remove Product from Cart">
        <p className="section-description">
          Removes a product from the cart by its internalId. Use getCurrentCart to find the internalId of items in the cart.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Internal ID:</label>
            <input
              type="text"
              value={removeProductInternalId}
              onChange={(e) => setRemoveProductInternalId(e.target.value)}
              placeholder="Cart item internalId"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setRemoveProductResponse('Error: Not running in iframe');
              return;
            }
            if (!removeProductInternalId) {
              setRemoveProductResponse('Error: Please enter an internalId');
              return;
            }
            setRemoveProductLoading(true);
            setRemoveProductResponse('');
            try {
              const result = await command.removeProductFromCart({
                internalId: removeProductInternalId
              });
              setRemoveProductResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setRemoveProductResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setRemoveProductLoading(false);
            }
          }}
          disabled={removeProductLoading}
          className="btn btn--danger"
        >
          {removeProductLoading ? 'Removing...' : 'Remove from Cart'}
        </button>
        {removeProductResponse && (
          <JsonViewer
            data={removeProductResponse}
            title={removeProductResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Update Cart Item Quantity */}
      <CommandSection title="Update Cart Item Quantity">
        <p className="section-description">
          Updates the quantity of a cart item by its internalId. Set quantity to 0 to remove the item. Stock validation is performed when increasing quantity.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Internal ID:</label>
            <input
              type="text"
              value={updateQuantityInternalId}
              onChange={(e) => setUpdateQuantityInternalId(e.target.value)}
              placeholder="Cart item internalId"
            />
          </div>
          <div className="form-field">
            <label>Quantity:</label>
            <input
              type="number"
              value={updateQuantityValue}
              onChange={(e) => setUpdateQuantityValue(e.target.value)}
              placeholder="1"
              min="0"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!isInIframe) {
              setUpdateQuantityResponse('Error: Not running in iframe');
              return;
            }
            if (!updateQuantityInternalId) {
              setUpdateQuantityResponse('Error: Please enter an internalId');
              return;
            }
            const quantity = parseFloat(updateQuantityValue);
            if (isNaN(quantity) || quantity < 0) {
              setUpdateQuantityResponse('Error: Please enter a valid quantity (>= 0)');
              return;
            }
            setUpdateQuantityLoading(true);
            setUpdateQuantityResponse('');
            try {
              const result = await command.updateCartItemQuantity({
                internalId: updateQuantityInternalId,
                quantity: quantity
              });
              setUpdateQuantityResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setUpdateQuantityResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setUpdateQuantityLoading(false);
            }
          }}
          disabled={updateQuantityLoading}
          className="btn btn--primary"
        >
          {updateQuantityLoading ? 'Updating...' : 'Update Quantity'}
        </button>
        {updateQuantityResponse && (
          <JsonViewer
            data={updateQuantityResponse}
            title={updateQuantityResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>
    </div>
  );
}

