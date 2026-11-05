import { useEffect, useRef, useState } from 'react';
import type { CustomCardConfiguration, OnChangeData } from '@adyen/adyen-web';
import {
  renderClient as command,
  type ChargeMotoCardFields,
  type GetMotoConfigResponse,
} from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

/**
 * MANUAL CARD ENTRY (keyed / MOTO) from a flow, end to end:
 *
 *   1. getMotoConfig — the host injects Adyen's client key at runtime (never bake one into a
 *      build); the runtime adds the company's country. `available: false` carries the reason.
 *   2. Adyen Custom Card — mount Adyen's own card fields (`@adyen/adyen-web`) into `data-cse`
 *      boxes. The card is encrypted inside Adyen's iframes; the digits never reach this app.
 *   3. chargeMoto — charge the CURRENT CART (products and all) with the encrypted fields.
 *
 * `amount` is required (integer minor units, at least 50) and is NOT defaulted to the balance:
 * read it from getCurrentCart. Hold one `idempotencyKey` per amount across retries (the hub
 * replays rather than charging twice); mint a new one when the amount changes.
 */

const FIELD_KEYS = [
  'encryptedCardNumber',
  'encryptedExpiryMonth',
  'encryptedExpiryYear',
  'encryptedSecurityCode',
] as const;

/** The four encrypted fields, once ALL are present — a partial set is not chargeable. */
function completeFields(state: OnChangeData): ChargeMotoCardFields | null {
  const pm = state.data.paymentMethod as Record<string, unknown>;
  const read = (k: (typeof FIELD_KEYS)[number]) => (typeof pm[k] === 'string' ? (pm[k] as string) : '');
  const fields = {
    encryptedCardNumber: read('encryptedCardNumber'),
    encryptedExpiryMonth: read('encryptedExpiryMonth'),
    encryptedExpiryYear: read('encryptedExpiryYear'),
    encryptedSecurityCode: read('encryptedSecurityCode'),
  };
  return FIELD_KEYS.every((k) => fields[k] !== '') ? fields : null;
}

export function MotoSection({ isInIframe }: { isInIframe: boolean }) {
  const [config, setConfig] = useState<GetMotoConfigResponse | null>(null);
  const [configResponse, setConfigResponse] = useState('');
  const [card, setCard] = useState<ChargeMotoCardFields | null>(null);
  const [postalCode, setPostalCode] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  /** One key per amount, held across retries (see the header). */
  const attemptRef = useRef<{ amount: number; key: string } | null>(null);

  const loadConfig = async () => {
    if (!isInIframe) {
      setConfigResponse('Error: Not running in iframe');
      return;
    }
    try {
      const result = await command.getMotoConfig();
      setConfigResponse(JSON.stringify(result, null, 2));
      setConfig(result);
    } catch (error) {
      setConfigResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Mount Adyen's card fields once a config with a key is in hand.
  useEffect(() => {
    const node = rootRef.current;
    if (!node || !config?.available) return;
    let disposed = false;
    let mounted: { remove(): void } | null = null;
    void (async () => {
      const { AdyenCheckout, CustomCard } = await import('@adyen/adyen-web');
      if (disposed) return;
      const checkout = await AdyenCheckout({
        clientKey: config.clientKey,
        environment: config.environment,
        countryCode: config.countryCode,
        analytics: { enabled: false },
      });
      if (disposed) return;
      const styles: CustomCardConfiguration['styles'] = { base: { fontSize: '16px' } };
      const custom = new CustomCard(checkout, {
        styles,
        onChange: (state: OnChangeData) => setCard(completeFields(state)),
      });
      custom.mount(node);
      mounted = custom;
    })().catch((error) => setResponse(`Error: card entry could not start — ${String(error)}`));
    return () => {
      disposed = true;
      mounted?.remove();
    };
  }, [config]);

  const charge = async () => {
    if (!card) return;
    setLoading(true);
    setResponse('');
    try {
      const { cart } = await command.getCurrentCart();
      const due = amount ? parseInt(amount, 10) : (cart?.amountToBeCharged ?? cart?.total ?? 0);
      const held = attemptRef.current;
      const idempotencyKey = held && held.amount === due ? held.key : crypto.randomUUID();
      attemptRef.current = { amount: due, key: idempotencyKey };
      const postal = postalCode.trim();
      const result = await command.chargeMoto({
        amount: due,
        card: postal ? { ...card, postalCode: postal } : card,
        idempotencyKey,
        // To keep a paid order open for the kitchen, pass a target as with any tender:
        // targetFulfillmentState: 'pending',
      });
      attemptRef.current = null; // spent — a later charge is a new attempt
      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      // Declines and failures REJECT as `CODE: message` (e.g. "MOTO_PAYMENT_FAILED: Refused").
      // The key is kept, so "try again" replays instead of double-charging.
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommandSection title="Manual card (MOTO)">
      <p className="section-description">
        Keyed card-not-present payment on the current cart: <code>getMotoConfig</code> → Adyen card fields →{' '}
        <code>chargeMoto</code>. Adyen only. Add a product to the cart first.
      </p>
      <button onClick={loadConfig} className="btn btn--primary">
        Get MOTO config
      </button>
      {configResponse && (
        <JsonViewer data={configResponse} title={configResponse.startsWith('Error') ? 'Error' : 'Success'} />
      )}

      {config?.available && (
        <>
          <div ref={rootRef} className="form-group">
            {/* Adyen mounts an iframe into each data-cse box; keep nothing else inside them. */}
            <div className="form-field">
              <label>Card number:</label>
              <span data-cse="encryptedCardNumber" style={{ display: 'block', height: 40 }} />
            </div>
            <div className="form-field">
              <label>Expiry (MM / YY):</label>
              <span style={{ display: 'flex', gap: 8, height: 40 }}>
                <span data-cse="encryptedExpiryMonth" style={{ flex: 1 }} />
                <span data-cse="encryptedExpiryYear" style={{ flex: 1 }} />
              </span>
            </div>
            <div className="form-field">
              <label>CVC:</label>
              <span data-cse="encryptedSecurityCode" style={{ display: 'block', height: 40 }} />
            </div>
          </div>
          <div className="form-group">
            <div className="form-field">
              <label>Postal code (optional, AVS):</label>
              <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Amount (optional):</label>
              <input
                type="number"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Minor units — empty = balance due"
              />
            </div>
          </div>
          <button onClick={charge} disabled={!card || loading} className="btn btn--primary">
            {loading ? 'Charging...' : 'Charge MOTO'}
          </button>
        </>
      )}
      {response && <JsonViewer data={response} title={response.startsWith('Error') ? 'Error' : 'Success'} />}
    </CommandSection>
  );
}
