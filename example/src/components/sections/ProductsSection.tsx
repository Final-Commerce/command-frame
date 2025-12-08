import { useState } from 'react';
import { command } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface ProductsSectionProps {
  isInIframe: boolean;
}

export function ProductsSection({ isInIframe }: ProductsSectionProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string>('');
  
  const [variants, setVariants] = useState<any[]>([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variantsError, setVariantsError] = useState<string>('');
  const [variantProductId, setVariantProductId] = useState<string>('');
  
  const [variantId, setVariantId] = useState<string>('');
  const [setProductActiveLoading, setSetProductActiveLoading] = useState(false);
  const [setProductActiveResponse, setSetProductActiveResponse] = useState<string>('');

  // Product Note
  const [productNote, setProductNote] = useState<string>('');
  const [addProductNoteLoading, setAddProductNoteLoading] = useState(false);
  const [addProductNoteResponse, setAddProductNoteResponse] = useState<string>('');

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

  const handleGetProducts = async () => {
    if (!isInIframe) {
      setProductsError('Error: Not running in iframe');
      return;
    }

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

  const handleGetProductVariants = async () => {
    if (!isInIframe) {
      setVariantsError('Error: Not running in iframe');
      return;
    }

    if (!variantProductId) {
      setVariantsError('Error: Please enter a product ID');
      return;
    }

    setVariantsLoading(true);
    setVariants([]);
    setVariantsError('');

    try {
      const result = await command.getProductVariants({
        productId: variantProductId
      });
      
      if (result && typeof result === 'object') {
        if (result.variants && Array.isArray(result.variants)) {
          setVariants(result.variants);
        } else {
          setVariantsError(`Invalid response format. Expected variants array, got: ${JSON.stringify(result).substring(0, 100)}`);
        }
      } else {
        setVariantsError('Invalid response format: result is not an object');
      }
    } catch (error) {
      setVariantsError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setVariantsLoading(false);
    }
  };

  const handleSetProductActive = async () => {
    if (!isInIframe) {
      setSetProductActiveResponse('Error: Not running in iframe');
      return;
    }

    if (!variantId) {
      setSetProductActiveResponse('Error: Please enter a variant ID');
      return;
    }

    setSetProductActiveLoading(true);
    setSetProductActiveResponse('');

    try {
      const result = await command.setProductActive({
        variantId: variantId
      });
      
      setSetProductActiveResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setSetProductActiveResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSetProductActiveLoading(false);
    }
  };

  const getProductPrice = (product: any): string => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants
        .map((v: any) => v.price)
        .filter((p: any): p is string => p != null && !isNaN(Number(p)))
        .map((p: string) => Number(p));
      
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
                      onClick={() => {
                        if (productId) {
                          setVariantProductId(productId);
                        }
                      }}
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

      <CommandSection title="Get Product Variants">
        <div className="form-group">
          <label className="form-label">Product ID:</label>
          <input
            type="text"
            value={variantProductId}
            onChange={(e) => setVariantProductId(e.target.value)}
            className="form-input"
            placeholder="Enter Product ID"
          />
        </div>
        <button 
          onClick={handleGetProductVariants} 
          disabled={variantsLoading}
          className="btn btn--primary"
        >
          {variantsLoading ? 'Loading...' : 'Get Variants'}
        </button>
        
        {variantsError && (
          <JsonViewer data={variantsError} title="Error" />
        )}
        
        {variants.length > 0 && (
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
                      <td className="text-right">{variant.price ? `$${parseFloat(variant.price).toFixed(2)}` : '—'}</td>
                      <td className="text-right">{variant.salePrice ? `$${parseFloat(variant.salePrice).toFixed(2)}` : '—'}</td>
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
        )}
      </CommandSection>

      <CommandSection title="Set Product Active">
        <div className="form-group">
          <label className="form-label">Variant ID:</label>
          <input
            type="text"
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            className="form-input"
            placeholder="Enter Variant ID"
          />
        </div>
        <button 
          onClick={handleSetProductActive} 
          disabled={setProductActiveLoading}
          className="btn btn--primary"
        >
          {setProductActiveLoading ? 'Setting...' : 'Set Active'}
        </button>
        
        {setProductActiveResponse && (
          <JsonViewer 
            data={setProductActiveResponse} 
            title={setProductActiveResponse.startsWith('Error') ? 'Error' : 'Success'} 
          />
        )}
      </CommandSection>

      <CommandSection title="Add Product Note">
        <p className="section-description">
          Adds a note to the currently active product. Requires a product to be set as active first.
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
            if (!isInIframe) {
              setAddProductNoteResponse('Error: Not running in iframe');
              return;
            }
            if (!productNote) {
              setAddProductNoteResponse('Error: Note is required');
              return;
            }
            setAddProductNoteLoading(true);
            setAddProductNoteResponse('');
            try {
              const result = await command.addProductNote({ note: productNote });
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
          {addProductNoteLoading ? 'Adding...' : 'Add Note'}
        </button>
        {addProductNoteResponse && (
          <JsonViewer
            data={addProductNoteResponse}
            title={addProductNoteResponse.startsWith('Error') ? 'Error' : 'Success'}
          />
        )}
      </CommandSection>

      <CommandSection title="Add Product Fee">
        <p className="section-description">
          Adds a fee to the currently active product. Requires a product to be set as active first.
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
            if (!isInIframe) {
              setAddProductFeeResponse('Error: Not running in iframe');
              return;
            }
            if (!productFeeAmount) {
              setAddProductFeeResponse('Error: Amount is required');
              return;
            }
            setAddProductFeeLoading(true);
            setAddProductFeeResponse('');
            try {
              const result = await command.addProductFee({
                amount: parseFloat(productFeeAmount) || 0,
                isPercent: productFeeIsPercent,
                label: productFeeLabel,
                applyTaxes: productFeeApplyTaxes
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
          {addProductFeeLoading ? 'Adding...' : 'Add Fee'}
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
          Adjusts the inventory/stock level for the currently active product. Requires a product to be set as active first.
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
            if (!isInIframe) {
              setAdjustInventoryResponse('Error: Not running in iframe');
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
    </div>
  );
}

