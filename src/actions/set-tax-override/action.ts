/**
 * Set tax override action
 * Calls the setTaxOverride action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { SetTaxOverride, SetTaxOverrideParams, SetTaxOverrideResponse } from './types';

export const setTaxOverride: SetTaxOverride = async (params: SetTaxOverrideParams): Promise<SetTaxOverrideResponse> => {
  return await commandFrameClient.call<SetTaxOverrideParams, SetTaxOverrideResponse>('setTaxOverride', params);
};
