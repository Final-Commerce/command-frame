/**
 * Get MOTO config — everything a flow needs to take a keyed (card-not-present) payment itself:
 * mount the processor's own card-entry fields, then send what they produce to `chargeMoto`.
 */

/** Why manual card entry is not available here. */
export type MotoUnavailableReason =
  /** The company does not take new sales on Adyen (keyed charges are Adyen-only today). */
  | 'provider-unsupported'
  /** The host injected no Adyen client key (an older host, or an environment without one). */
  | 'no-client-key'
  /** The company's Adyen integration has no country yet. */
  | 'no-country'
  /** No active company. */
  | 'no-company';

export type GetMotoConfigResponse = {
  success: boolean;
  timestamp: string;
} & (
  | {
      available: true;
      provider: 'adyen';
      /**
       * Adyen's PUBLISHABLE client key for `@adyen/adyen-web`'s `AdyenCheckout({ clientKey })`.
       * Injected by the host at runtime — never bake one into a flow build.
       */
      clientKey: string;
      /** `AdyenCheckout({ environment })`. */
      environment: 'test' | 'live';
      /** The company's country, ISO 3166-1 alpha-2 — `AdyenCheckout({ countryCode })`. */
      countryCode: string;
    }
  | {
      available: false;
      reason: MotoUnavailableReason;
    }
);

export type GetMotoConfig = () => Promise<GetMotoConfigResponse>;
