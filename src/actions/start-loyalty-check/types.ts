import type { CFLoyaltyOutcome } from '../../CommonTypes';

/** One of them: what the customer typed or scanned. */
export interface StartLoyaltyCheckParams {
  /** The nine digits on the card: the code goes to the phone on the card, else its email. */
  cardNumber?: string;
  /** Theirs: a member's, or someone about to join. */
  phone?: string;
  email?: string;
}

export interface StartLoyaltyCheckResponse extends CFLoyaltyOutcome {
  /** How the code went. Never where: a card's phone or email is not shown on a screen. */
  channel?: 'sms' | 'email';
  /** The code stops working then. */
  expiresAt?: string;
}

export type StartLoyaltyCheck = (params: StartLoyaltyCheckParams) => Promise<StartLoyaltyCheckResponse>;
