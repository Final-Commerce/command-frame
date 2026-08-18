import { CFAttribute } from '../../CommonTypes';

// Deerlake parity: rename and/or FULL option-set replace (spec §3.1).
export interface EditAttributeParams {
  attributeId: string;
  optionName?: string;
  /** FULL replacement of the option set when provided. */
  options?: { name: string; order: number }[];
}

export interface EditAttributeResponse {
  success: boolean;
  attribute: CFAttribute;
  timestamp: string;
}

export type EditAttribute = (params: EditAttributeParams) => Promise<EditAttributeResponse>;
