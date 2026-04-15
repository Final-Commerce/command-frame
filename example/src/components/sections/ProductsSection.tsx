import { useState } from 'react';
import { renderClient as command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface ProductsSectionProps {
  isInIframe: boolean;
}

export function ProductsSection({ isInIframe: _ }: ProductsSectionProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string>('');
  
  const [variants, setVariants] = useState<any[]>([]);
  const [variantId, setVariantId] = useState<string>('');
  const [productId, setProductId] = useState<string>('');

  const [addProductLoading, setAddProductLoading] = useState(false);
  const [addProductResponse, setAddProductResponse] = useState<string>('');

  // Product Note
  const [productNote, setProductNote] = useState<string>('');
  const [addProductNoteLoading, setAddProductNoteLoading] = useState(false);
  const [addProductNoteResponse, setAddProductNoteResponse] = useState<string>('');

  // Set Active Product
  const [setActiveProductLoading, setSetActiveProductLoading] = useState(false);
  const [setActiveProductResponse, setSetActiveProductResponse] = useState<string>('');

  // Get Active Product
  const [getActiveProductLoading, setGetActiveProductLoading] = useState(false);
  const [getActiveProductResponse, setGetActiveProductResponse] = useState<string>('');

  // Product Fee
  const [productFeeAmount, setProductFeeAmount] = useState<string>('5.00');
  const [productFeeIsPercent, setProductFeeIsPercent] = useState<boolean>(false);
  const [productFeeLabel, setProductFeeLabel] = useState<string>('Service Fee');
  const [productFeeApplyTaxes, setProductFeeApplyTaxes] = useState<boolean>(false);
  const [addProductFeeLoading, setAddProductFeeLoading] = useState(false);
  const [addProductFeeResponse, setAddProductFeeResponse] = useState<string>('');

  // Adjust Inventory
  const [inventoryAmount, setInventoryAmount] = useState<string>('10');
  const [inventoryStockType, setInventoryStockType] = useState<'add' | 'subtract' | 'set'>('add');
  const [adjustInventoryLoading, setAdjustInventoryLoading] = useState(false);
  const [adjustInventoryResponse, setAdjustInventoryResponse] = useState<string>('');

  // Add Product Discount (standalone)
  const [discountAmount, setDiscountAmount] = useState<string>('5.00');
  const [discountIsPercent, setDiscountIsPercent] = useState<boolean>(false);
  const [discountLabel, setDiscountLabel] = useState<string>('Discount');
  const [discountInternalId, setDiscountInternalId] = useState<string>('');
  const [addDiscountLoading, setAddDiscountLoading] = useState(false);
  const [addDiscountResponse, setAddDiscountResponse] = useState<string>('');

  // Remove Product Discount
  const [removeDiscountInternalId, setRemoveDiscountInternalId] = useState<string>('');
  const [removeDiscountLoading, setRemoveDiscountLoading] = useState(false);
  const [removeDiscountResponse, setRemoveDiscountResponse] = useState<string>('');

  // Add Product Fee (standalone)
  const [standaloneFeeAmount, setStandaloneFeeAmount] = useState<string>('2.00');
  const [standaloneFeeIsPercent, setStandaloneFeeIsPercent] = useState<boolean>(false);
  const [standaloneFeeLabel, setStandaloneFeeLabel] = useState<string>('Extra Fee');
  const [standaloneFeeApplyTaxes, setStandaloneFeeApplyTaxes] = useState<boolean>(false);
  const [standaloneFeeInternalId, setStandaloneFeeInternalId] = useState<string>('');
  const [addStandaloneFeeLoading, setAddStandaloneFeeLoading] = useState(false);
  const [addStandaloneFeeResponse, setAddStandaloneFeeResponse] = useState<string>('');

  // Remove Product Fee
  const [removeFeeInternalId, setRemoveFeeInternalId] = useState<string>('');
  const [removeFeeLoading, setRemoveFeeLoading] = useState(false);
  const [removeFeeResponse, setRemoveFeeResponse] = useState<string>('');

  // Add Product Note (standalone)
  const [standaloneNote, setStandaloneNote] = useState<string>('');
  const [standaloneNoteInternalId, setStandaloneNoteInternalId] = useState<string>('');
  const [addStandaloneNoteLoading, setAddStandaloneNoteLoading] = useState(false);
  const [addStandaloneNoteResponse, setAddStandaloneNoteResponse] = useState<string>('');

  // Remove Product Note
  const [removeNoteInternalId, setRemoveNoteInternalId] = useState<string>('');
  const [removeNoteLoading, setRemoveNoteLoading] = useState(false);
  const [removeNoteResponse, setRemoveNoteResponse] = useState<string>('');

  const handleGetProducts = async () => {
    // if (!isInIframe) {
    //   setProductsError('Error: Not running in iframe');
    //   return;
    // }

    setProductsLoading(true);
    setProducts([]);
    setProductsError('');

    try {
      const result = await command.getProducts({});
      
      if (result && typeof result === 'object') {
        if (result.products && Array.isArray(result.products)) {
          setProducts(result.products);
        } else if (Array.isArray(result)) {
          setProducts(result);
        } else {
          setProductsError(`Invalid response format. Expected products array, got: ${JSON.stringify(result).substring(0, 100)}`);
        }
      } else {
        setProductsError('Invalid response format: result is not an object');
      }
    } catch (error) {
      setProductsError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleProductSelect = (product: any) => {
    const selectedProductId = product._id || product.id;
    if (selectedProductId) {
      setProductId(selectedProductId);
      if (product.variants && Array.isArray(product.variants)) {
        setVariants(product.variants);
      } else {
        setVariants([]);
      }
    }
  };

  const getProductPrice = (product: any): string => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants
        .map((v: any) => v.price)
        .filter((p: any): p is number => p != null && !isNaN(Number(p)))
        .map(Number);
      
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return minPrice === maxPrice 
          ? `$${minPrice.toFixed(2)}` 
          : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
      }
    }
    return 'N/A';
  };

  const getProductImage = (product: any): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '';
  };

  return (
    <div className="section-content">
      <CommandSection title="Get Products">
        <button 
          onClick={handleGetProducts} 
          disabled={productsLoading}
          className="btn btn--primary"
        >
          {productsLoading ? 'Loading...' : 'Get Products'}
        </button>
        
        {productsError && (
          <JsonViewer data={productsError} title="Error" />
        )}
        
        {products.length > 0 && (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Picture</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  const productId = product._id || product.id;
                  return (
                    <tr 
                      key={productId || index}
                      onClick={() => handleProductSelect(product)}
                      className="data-table__row--clickable"
                    >
                      <td>
                        {getProductImage(product) ? (
                          <img 
                            src={getProductImage(product)} 
                            alt={product.name || 'Product'} 
                            className="product-image"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="product-image-placeholder">No img</div>
                        )}
                      </td>
                      <td>{product.name || 'Unnamed Product'}</td>
                      <td className="text-right">{getProductPrice(product)}</td>
                      <td>{product.source || ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="data-table-footer">
              <strong>Total: {products.length} products</strong>
            </div>
          </div>
        )}
      </CommandSection>

      <CommandSection title="Product Variants (Select from list above)">
        <p className="section-description">
          Click on a product in the table above to see its variants.
        </p>
        
        {variants.length > 0 ? (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name/SKU</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Sale Price</th>
                  <th>Barcode</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, index) => {
                  const variantIdValue = variant._id || variant.id;
                  return (
                    <tr 
                      key={variantIdValue || index}
                      onClick={() => {
                        if (variantIdValue) {
                          setVariantId(variantIdValue);
                        }
                      }}
                      className="data-table__row--clickable"
                    >
                      <td>{variant.name || variant.sku || 'Unnamed Variant'}</td>
                      <td className="text-right">{variant.price != null ? `$${Number(variant.price).toFixed(2)}` : '—'}</td>
                      <td className="text-right">{variant.salePrice ? `$${Number(variant.salePrice).toFixed(2)}` : '—'}</td>
                      <td>{variant.barcode || '—'}</td>
                      <td className="text-muted">{variantIdValue || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="data-table-footer">
              <strong>Total: {variants.length} variants</strong>
            </div>
          </div>
        ) : (
          <p className="no-data-message">Select a product to view variants</p>
        )}
      </CommandSection>
      
      <CommandSection title="Selected Variant">
        <p className="section-description">
          Select a variant from the table above or enter IDs manually to use for actions below.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label className="form-label">Product ID:</label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="form-input"
              placeholder="Enter Product ID"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Variant ID:</label>
            <input
              type="text"
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              className="form-input"
              placeholder="Enter Variant ID"
            />
          </div>
        </div>
      </CommandSection>

      {/* Set Active Product */}
      <CommandSection title="Set Active Product">
        <p className="section-description">
          Set an active product using the selected variant ID.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Variant ID:</label>
            <input
              type="text"
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              placeholder="Enter Variant ID"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!variantId) {
              setSetActiveProductResponse('Error: Variant ID is required');
              return;
            }
            setSetActiveProductLoading(true);
            setSetActiveProductResponse('');
            try {
              const result = await command.setActiveProduct({ variantId });
              setSetActiveProductResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setSetActiveProductResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setSetActiveProductLoading(false);
            }
          }}
          disabled={setActiveProductLoading}
          className="btn btn--primary"
        >
          {setActiveProductLoading ? 'Setting...' : 'Set Active Product'}
        </button>
        {setActiveProductResponse && (
          <JsonViewer
            data={setActiveProductResponse}
            title={setActiveProductResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* get active product */}
      <CommandSection title="Get Active Product">
        <p className='section-description'> 
          Get Active Product 
        </p>
        <button
          onClick={async () => {
            setGetActiveProductLoading(true);
            setGetActiveProductResponse('');
            try {
              const result = await command.getActiveProduct();
              if (result?.product?.variantId) {
                setVariantId(result.product.variantId);
              }
              setGetActiveProductResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setGetActiveProductResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setGetActiveProductLoading(false);
            }
          }}
          disabled={getActiveProductLoading}
          className="btn btn--primary"
        >
          {getActiveProductLoading ? 'Getting...' : 'Get Active Product'}
        </button>
        {getActiveProductResponse && (
          <JsonViewer
            data={getActiveProductResponse}
            title={getActiveProductResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>




      <CommandSection title="Add Product to Cart">
        <p className="section-description">
          Adds the selected variant to cart (simple add).
        </p>
        <button
          onClick={async () => {
            // if (!isInIframe) {
            //   setAddProductResponse('Error: Not running in iframe');
            //   return;
            // }
            if (!variantId) {
              setAddProductResponse('Error: Variant ID is required');
              return;
            }
            setAddProductLoading(true);
            setAddProductResponse('');
            try {
              const result = await command.addProductToCart({ 
                variantId,
                quantity: 1
              });
              setAddProductResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setAddProductResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setAddProductLoading(false);
            }
          }}
          disabled={addProductLoading}
          className="btn btn--primary"
        >
          {addProductLoading ? 'Adding...' : 'Add to Cart'}
        </button>
        {addProductResponse && (
          <JsonViewer
            data={addProductResponse}
            title={addProductResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Add Product to Cart with Note">
        <p className="section-description">
          Adds the selected variant to cart with a note attached.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Note:</label>
            <textarea
              value={productNote}
              onChange={(e) => setProductNote(e.target.value)}
              placeholder="Enter note text"
              rows={3}
            />
          </div>
        </div>
        <button
          onClick={async () => {
            // if (!isInIframe) {
            //   setAddProductNoteResponse('Error: Not running in iframe');
            //   return;
            // }
            if (!variantId) {
              setAddProductNoteResponse('Error: Variant ID is required');
              return;
            }
            if (!productNote) {
              setAddProductNoteResponse('Error: Note is required');
              return;
            }
            setAddProductNoteLoading(true);
            setAddProductNoteResponse('');
            try {
              const result = await command.addProductToCart({ 
                variantId,
                quantity: 1,
                notes: productNote 
              });
              setAddProductNoteResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setAddProductNoteResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setAddProductNoteLoading(false);
            }
          }}
          disabled={addProductNoteLoading}
          className="btn btn--primary"
        >
          {addProductNoteLoading ? 'Adding...' : 'Add to Cart with Note'}
        </button>
        {addProductNoteResponse && (
          <JsonViewer
            data={addProductNoteResponse}
            title={addProductNoteResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Add Product to Cart with Fee">
        <p className="section-description">
          Adds the selected variant to cart with a fee attached.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Amount:</label>
            <input
              type="number"
              step="0.01"
              value={productFeeAmount}
              onChange={(e) => setProductFeeAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="form-field">
            <label>Label:</label>
            <input
              type="text"
              value={productFeeLabel}
              onChange={(e) => setProductFeeLabel(e.target.value)}
              placeholder="Fee label"
            />
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={productFeeIsPercent}
                onChange={(e) => setProductFeeIsPercent(e.target.checked)}
              />
              <span>Is Percentage</span>
            </label>
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={productFeeApplyTaxes}
                onChange={(e) => setProductFeeApplyTaxes(e.target.checked)}
              />
              <span>Apply Taxes</span>
            </label>
          </div>
        </div>
        <button
          onClick={async () => {
            // if (!isInIframe) {
            //   setAddProductFeeResponse('Error: Not running in iframe');
            //   return;
            // }
            if (!variantId) {
              setAddProductFeeResponse('Error: Variant ID is required');
              return;
            }
            if (!productFeeAmount) {
              setAddProductFeeResponse('Error: Amount is required');
              return;
            }
            setAddProductFeeLoading(true);
            setAddProductFeeResponse('');
            try {
              const result = await command.addProductToCart({
                variantId,
                quantity: 1,
                fees: [{
                  amount: parseFloat(productFeeAmount) || 0,
                  isPercent: productFeeIsPercent,
                  label: productFeeLabel,
                  applyTaxes: productFeeApplyTaxes
                }]
              });
              setAddProductFeeResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setAddProductFeeResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setAddProductFeeLoading(false);
            }
          }}
          disabled={addProductFeeLoading}
          className="btn btn--primary"
        >
          {addProductFeeLoading ? 'Adding...' : 'Add to Cart with Fee'}
        </button>
        {addProductFeeResponse && (
          <JsonViewer
            data={addProductFeeResponse}
            title={addProductFeeResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Adjust Inventory">
        <p className="section-description">
          Adjusts the inventory/stock level for the selected variant.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Amount:</label>
            <input
              type="text"
              value={inventoryAmount}
              onChange={(e) => setInventoryAmount(e.target.value)}
              placeholder="10"
            />
          </div>
          <div className="form-field">
            <label>Stock Type:</label>
            <select
              value={inventoryStockType}
              onChange={(e) => setInventoryStockType(e.target.value as 'add' | 'subtract' | 'set')}
            >
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
              <option value="set">Set</option>
            </select>
          </div>
        </div>
        <button
          onClick={async () => {
            // if (!isInIframe) {
            //   setAdjustInventoryResponse('Error: Not running in iframe');
            //   return;
            // }
            if (!variantId) {
              setAdjustInventoryResponse('Error: Variant ID is required');
              return;
            }
            if (!inventoryAmount) {
              setAdjustInventoryResponse('Error: Amount is required');
              return;
            }
            setAdjustInventoryLoading(true);
            setAdjustInventoryResponse('');
            try {
              const result = await command.adjustInventory({
                variantId,
                amount: inventoryAmount,
                stockType: inventoryStockType
              });
              setAdjustInventoryResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setAdjustInventoryResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setAdjustInventoryLoading(false);
            }
          }}
          disabled={adjustInventoryLoading}
          className="btn btn--primary"
        >
          {adjustInventoryLoading ? 'Adjusting...' : 'Adjust Inventory'}
        </button>
        {adjustInventoryResponse && (
          <JsonViewer
            data={adjustInventoryResponse}
            title={adjustInventoryResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Add Product Discount (standalone) */}
      <CommandSection title="Add Product Discount">
        <p className="section-description">
          Adds a discount to a product in the cart. Provide an internalId to target a specific cart item, or leave empty to use the active product.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Amount:</label>
            <input
              type="number"
              step="0.01"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="form-field">
            <label>Label:</label>
            <input
              type="text"
              value={discountLabel}
              onChange={(e) => setDiscountLabel(e.target.value)}
              placeholder="Discount label"
            />
          </div>
          <div className="form-field">
            <label>Internal ID (optional):</label>
            <input
              type="text"
              value={discountInternalId}
              onChange={(e) => setDiscountInternalId(e.target.value)}
              placeholder="Cart item internalId"
            />
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={discountIsPercent}
                onChange={(e) => setDiscountIsPercent(e.target.checked)}
              />
              <span>Is Percentage</span>
            </label>
          </div>
        </div>
        <button
          onClick={async () => {
            if (!discountAmount) {
              setAddDiscountResponse('Error: Amount is required');
              return;
            }
            setAddDiscountLoading(true);
            setAddDiscountResponse('');
            try {
              const result = await command.addProductDiscount({
                amount: parseFloat(discountAmount) || 0,
                isPercent: discountIsPercent,
                label: discountLabel,
                ...(discountInternalId ? { internalId: discountInternalId } : {})
              });
              setAddDiscountResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setAddDiscountResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setAddDiscountLoading(false);
            }
          }}
          disabled={addDiscountLoading}
          className="btn btn--primary"
        >
          {addDiscountLoading ? 'Adding...' : 'Add Product Discount'}
        </button>
        {addDiscountResponse && (
          <JsonViewer
            data={addDiscountResponse}
            title={addDiscountResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Remove Product Discount */}
      <CommandSection title="Remove Product Discount">
        <p className="section-description">
          Removes a discount from a product in the cart. Provide an internalId to target a specific cart item, or leave empty to use the active product.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Internal ID (optional):</label>
            <input
              type="text"
              value={removeDiscountInternalId}
              onChange={(e) => setRemoveDiscountInternalId(e.target.value)}
              placeholder="Cart item internalId"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            setRemoveDiscountLoading(true);
            setRemoveDiscountResponse('');
            try {
              const result = await command.removeProductDiscount(
                removeDiscountInternalId ? { internalId: removeDiscountInternalId } : undefined
              );
              setRemoveDiscountResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setRemoveDiscountResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setRemoveDiscountLoading(false);
            }
          }}
          disabled={removeDiscountLoading}
          className="btn btn--danger"
        >
          {removeDiscountLoading ? 'Removing...' : 'Remove Product Discount'}
        </button>
        {removeDiscountResponse && (
          <JsonViewer
            data={removeDiscountResponse}
            title={removeDiscountResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Add Product Fee (standalone) */}
      <CommandSection title="Add Product Fee">
        <p className="section-description">
          Adds a fee to a product in the cart. Provide an internalId to target a specific cart item, or leave empty to use the active product.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Amount:</label>
            <input
              type="number"
              step="0.01"
              value={standaloneFeeAmount}
              onChange={(e) => setStandaloneFeeAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="form-field">
            <label>Label:</label>
            <input
              type="text"
              value={standaloneFeeLabel}
              onChange={(e) => setStandaloneFeeLabel(e.target.value)}
              placeholder="Fee label"
            />
          </div>
          <div className="form-field">
            <label>Internal ID (optional):</label>
            <input
              type="text"
              value={standaloneFeeInternalId}
              onChange={(e) => setStandaloneFeeInternalId(e.target.value)}
              placeholder="Cart item internalId"
            />
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={standaloneFeeIsPercent}
                onChange={(e) => setStandaloneFeeIsPercent(e.target.checked)}
              />
              <span>Is Percentage</span>
            </label>
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={standaloneFeeApplyTaxes}
                onChange={(e) => setStandaloneFeeApplyTaxes(e.target.checked)}
              />
              <span>Apply Taxes</span>
            </label>
          </div>
        </div>
        <button
          onClick={async () => {
            if (!standaloneFeeAmount) {
              setAddStandaloneFeeResponse('Error: Amount is required');
              return;
            }
            setAddStandaloneFeeLoading(true);
            setAddStandaloneFeeResponse('');
            try {
              const result = await command.addProductFee({
                amount: parseFloat(standaloneFeeAmount) || 0,
                isPercent: standaloneFeeIsPercent,
                label: standaloneFeeLabel,
                applyTaxes: standaloneFeeApplyTaxes,
                ...(standaloneFeeInternalId ? { internalId: standaloneFeeInternalId } : {})
              });
              setAddStandaloneFeeResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setAddStandaloneFeeResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setAddStandaloneFeeLoading(false);
            }
          }}
          disabled={addStandaloneFeeLoading}
          className="btn btn--primary"
        >
          {addStandaloneFeeLoading ? 'Adding...' : 'Add Product Fee'}
        </button>
        {addStandaloneFeeResponse && (
          <JsonViewer
            data={addStandaloneFeeResponse}
            title={addStandaloneFeeResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Remove Product Fee */}
      <CommandSection title="Remove Product Fee">
        <p className="section-description">
          Removes a fee from a product in the cart. Provide an internalId to target a specific cart item, or leave empty to use the active product.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Internal ID (optional):</label>
            <input
              type="text"
              value={removeFeeInternalId}
              onChange={(e) => setRemoveFeeInternalId(e.target.value)}
              placeholder="Cart item internalId"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            setRemoveFeeLoading(true);
            setRemoveFeeResponse('');
            try {
              const result = await command.removeProductFee(
                removeFeeInternalId ? { internalId: removeFeeInternalId } : undefined
              );
              setRemoveFeeResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setRemoveFeeResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setRemoveFeeLoading(false);
            }
          }}
          disabled={removeFeeLoading}
          className="btn btn--danger"
        >
          {removeFeeLoading ? 'Removing...' : 'Remove Product Fee'}
        </button>
        {removeFeeResponse && (
          <JsonViewer
            data={removeFeeResponse}
            title={removeFeeResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Add Product Note (standalone) */}
      <CommandSection title="Add Product Note">
        <p className="section-description">
          Adds a note to a product in the cart. Provide an internalId to target a specific cart item, or leave empty to use the active product.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Note:</label>
            <textarea
              value={standaloneNote}
              onChange={(e) => setStandaloneNote(e.target.value)}
              placeholder="Enter note text"
              rows={3}
            />
          </div>
          <div className="form-field">
            <label>Internal ID (optional):</label>
            <input
              type="text"
              value={standaloneNoteInternalId}
              onChange={(e) => setStandaloneNoteInternalId(e.target.value)}
              placeholder="Cart item internalId"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            if (!standaloneNote) {
              setAddStandaloneNoteResponse('Error: Note is required');
              return;
            }
            setAddStandaloneNoteLoading(true);
            setAddStandaloneNoteResponse('');
            try {
              const result = await command.addProductNote({
                note: standaloneNote,
                ...(standaloneNoteInternalId ? { internalId: standaloneNoteInternalId } : {})
              });
              setAddStandaloneNoteResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setAddStandaloneNoteResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setAddStandaloneNoteLoading(false);
            }
          }}
          disabled={addStandaloneNoteLoading}
          className="btn btn--primary"
        >
          {addStandaloneNoteLoading ? 'Adding...' : 'Add Product Note'}
        </button>
        {addStandaloneNoteResponse && (
          <JsonViewer
            data={addStandaloneNoteResponse}
            title={addStandaloneNoteResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      {/* Remove Product Note */}
      <CommandSection title="Remove Product Note">
        <p className="section-description">
          Removes a note from a product in the cart. Provide an internalId to target a specific cart item, or leave empty to use the active product.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Internal ID (optional):</label>
            <input
              type="text"
              value={removeNoteInternalId}
              onChange={(e) => setRemoveNoteInternalId(e.target.value)}
              placeholder="Cart item internalId"
            />
          </div>
        </div>
        <button
          onClick={async () => {
            setRemoveNoteLoading(true);
            setRemoveNoteResponse('');
            try {
              const result = await command.removeProductNote(
                removeNoteInternalId ? { internalId: removeNoteInternalId } : undefined
              );
              setRemoveNoteResponse(JSON.stringify(result, null, 2));
            } catch (error) {
              setRemoveNoteResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
              setRemoveNoteLoading(false);
            }
          }}
          disabled={removeNoteLoading}
          className="btn btn--danger"
        >
          {removeNoteLoading ? 'Removing...' : 'Remove Product Note'}
        </button>
        {removeNoteResponse && (
          <JsonViewer
            data={removeNoteResponse}
            title={removeNoteResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>
    </div>
  );
}

