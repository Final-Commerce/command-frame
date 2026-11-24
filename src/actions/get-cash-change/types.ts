export interface GetCashChangeParams {
  /** Cash handed over, integer MINOR units (e.g. from common `parseAmountToMinorUnits`). */
  tenderedAmount: number;
  /** What it is tendered against, MINOR units. Default: the cart's balance due — the same default as `getCashRoundingAmount`. */
  amount?: number;
}

export interface GetCashChangeResponse {
  success: boolean;
  /** The amount tendered against, before cash rounding (MINOR units). */
  amountDue: number;
  /** After the company's cash-rounding setting — what `cashPayment` charges for cash (MINOR units). */
  roundedAmountDue: number;
  /** `roundedAmountDue − amountDue`, signed (MINOR units). 0 without a cash-rounding setting. */
  cashRounding: number;
  /** Echo of the tender (MINOR units). */
  tenderedAmount: number;
  /** ≥ 0: the change `cashPayment({ tenderedAmount })` returns for this tender. 0 while the tender is short. */
  change: number;
  /** ≥ 0: how much the tender is short of `roundedAmountDue`. 0 when it covers it. */
  remaining: number;
  timestamp: string;
}

export type GetCashChange = (params: GetCashChangeParams) => Promise<GetCashChangeResponse>;
