import { useState } from 'react';
import { renderClient as command, type ModifierSelection } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface ModifiersSectionProps {
  isInIframe: boolean;
}

const SELECTIONS_PLACEHOLDER = `[
  { "modifierId": "<modifier-id>", "choices": [{ "choiceId": "<choice-id>", "quantity": 1 }] }
]`;

/** Parse the selections textarea; returns a message on failure so the UI can show it. */
function parseSelections(raw: string): { selections?: ModifierSelection[]; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { selections: [] };
  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) return { error: 'Selections must be a JSON array' };
    return { selections: parsed as ModifierSelection[] };
  } catch (error) {
    return { error: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

export function ModifiersSection({ isInIframe: _ }: ModifiersSectionProps) {
  // Get Product Modifier Selections
  const [getInternalId, setGetInternalId] = useState<string>('');
  const [getLoading, setGetLoading] = useState(false);
  const [getResponse, setGetResponse] = useState<string>('');

  // Set Product Modifier Selections
  const [setInternalId, setSetInternalId] = useState<string>('');
  const [selectionsJson, setSelectionsJson] = useState<string>('');
  const [setLoading, setSetLoading] = useState(false);
  const [setResponse, setSetResponse] = useState<string>('');

  // Add Product To Cart with modifiers
  const [addVariantId, setAddVariantId] = useState<string>('');
  const [addQuantity, setAddQuantity] = useState<string>('1');
  const [addSelectionsJson, setAddSelectionsJson] = useState<string>('');
  const [addLoading, setAddLoading] = useState(false);
  const [addResponse, setAddResponse] = useState<string>('');

  const handleGet = async () => {
    setGetLoading(true);
    setGetResponse('');
    try {
      const result = await command.getProductModifierSelections(getInternalId ? { internalId: getInternalId } : {});
      setGetResponse(JSON.stringify(result, null, 2));
      // Pre-fill the setter so a read → edit → write round-trip is one copy away.
      if (result?.success && Array.isArray(result.selections)) {
        setSelectionsJson(JSON.stringify(result.selections, null, 2));
        if (result.internalId) setSetInternalId(result.internalId);
      }
    } catch (error) {
      setGetResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setGetLoading(false);
    }
  };

  const handleSet = async () => {
    const { selections, error } = parseSelections(selectionsJson);
    if (error || !selections) {
      setSetResponse(`Error: ${error}`);
      return;
    }
    setSetLoading(true);
    setSetResponse('');
    try {
      const result = await command.setProductModifierSelections({
        selections,
        ...(setInternalId ? { internalId: setInternalId } : {}),
      });
      setSetResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setSetResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSetLoading(false);
    }
  };

  const handleAddWithModifiers = async () => {
    if (!addVariantId) {
      setAddResponse('Error: Variant ID is required');
      return;
    }
    const { selections, error } = parseSelections(addSelectionsJson);
    if (error || !selections) {
      setAddResponse(`Error: ${error}`);
      return;
    }
    setAddLoading(true);
    setAddResponse('');
    try {
      const result = await command.addProductToCart({
        variantId: addVariantId,
        quantity: parseFloat(addQuantity) || 1,
        modifiers: selections,
      });
      setAddResponse(JSON.stringify(result, null, 2));
      if (result?.internalId) {
        setGetInternalId(result.internalId);
        setSetInternalId(result.internalId);
      }
    } catch (error) {
      setAddResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="section-content">
      <CommandSection title="Get Product Modifier Selections">
        <p className="section-description">
          Reads a cart line's modifier selections. <code>selections</code> are the raw ids that round-trip into the
          setter; <code>rows</code> are display-ready (&quot;Toppings - Avocado&quot; x2, <code>amount</code> in minor
          units) and <code>modifiersTotal</code> is their sum for this line. Leave Internal ID empty to read the active
          product's line. A successful read pre-fills the setter below.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Internal ID (optional):</label>
            <input
              type="text"
              value={getInternalId}
              onChange={(e) => setGetInternalId(e.target.value)}
              placeholder="Cart item internalId"
            />
          </div>
        </div>
        <button onClick={handleGet} disabled={getLoading} className="btn btn--primary">
          {getLoading ? 'Loading...' : 'Get Modifier Selections'}
        </button>
        {getResponse && (
          <JsonViewer data={getResponse} title={getResponse.startsWith('Error') ? 'Error' : 'Response'} />
        )}
      </CommandSection>

      <CommandSection title="Set Product Modifier Selections">
        <p className="section-description">
          Replaces a cart line's modifier selections. This is a <strong>full replacement</strong>, not a merge: send
          every modifier the line should keep, or <code>[]</code> to clear all optional modifiers. Selections are
          validated against the product's category-modifier rules (min/max units, required modifiers, outlet
          availability). A rule violation resolves with <code>success: false</code> and a <code>reason</code>; the line
          is unchanged. <code>quantity</code> on a choice is units per line-item unit.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Internal ID (optional):</label>
            <input
              type="text"
              value={setInternalId}
              onChange={(e) => setSetInternalId(e.target.value)}
              placeholder="Cart item internalId"
            />
          </div>
          <div className="form-field">
            <label>Selections (JSON array):</label>
            <textarea
              rows={8}
              value={selectionsJson}
              onChange={(e) => setSelectionsJson(e.target.value)}
              placeholder={SELECTIONS_PLACEHOLDER}
              spellCheck={false}
            />
          </div>
        </div>
        <div className="button-group">
          <button onClick={handleSet} disabled={setLoading} className="btn btn--primary">
            {setLoading ? 'Saving...' : 'Set Modifier Selections'}
          </button>
          <button onClick={() => setSelectionsJson('[]')} disabled={setLoading} className="btn btn--small">
            Use [] (clear all)
          </button>
        </div>
        {setResponse && (
          <JsonViewer data={setResponse} title={setResponse.startsWith('Error') ? 'Error' : 'Response'} />
        )}
      </CommandSection>

      <CommandSection title="Add Product To Cart With Modifiers">
        <p className="section-description">
          Creates a new cart line with modifiers already applied (<code>addProductToCart(&#123; modifiers &#125;)</code>
          ). The response carries the line's <code>internalId</code>, its display-ready <code>rows</code> and
          <code>modifiersTotal</code>. An unanswered required modifier resolves with <code>success: false</code>. On
          success the new <code>internalId</code> is copied into the two forms above.
        </p>
        <div className="form-group">
          <div className="form-field">
            <label>Variant ID:</label>
            <input
              type="text"
              value={addVariantId}
              onChange={(e) => setAddVariantId(e.target.value)}
              placeholder="Variant ID (from Products → Get Products)"
            />
          </div>
          <div className="form-field">
            <label>Quantity:</label>
            <input
              type="number"
              step="any"
              min="0"
              value={addQuantity}
              onChange={(e) => setAddQuantity(e.target.value)}
              placeholder="1"
            />
          </div>
          <div className="form-field">
            <label>Modifiers (JSON array):</label>
            <textarea
              rows={8}
              value={addSelectionsJson}
              onChange={(e) => setAddSelectionsJson(e.target.value)}
              placeholder={SELECTIONS_PLACEHOLDER}
              spellCheck={false}
            />
          </div>
        </div>
        <button onClick={handleAddWithModifiers} disabled={addLoading} className="btn btn--primary">
          {addLoading ? 'Adding...' : 'Add To Cart With Modifiers'}
        </button>
        {addResponse && (
          <JsonViewer data={addResponse} title={addResponse.startsWith('Error') ? 'Error' : 'Response'} />
        )}
      </CommandSection>
    </div>
  );
}
