import { CFAttribute } from '../../CommonTypes';

// Deerlake option semantics: optionName + ordered option values (spec §3.1).
export interface AddAttributeParams {
  optionName: string;
  sortingOrder?: number;
  options: { name: string; order: number }[];
  /** Honor a caller-generated ObjectId. */
  _id?: string;
}

export interface AddAttributeResponse {
  success: boolean;
  attribute: CFAttribute;
  timestamp: string;
}

export type AddAttribute = (params: AddAttributeParams) => Promise<AddAttributeResponse>;
