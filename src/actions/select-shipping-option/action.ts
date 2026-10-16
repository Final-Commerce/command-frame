/**
 * SelectShippingOption action
 * Calls the selectShippingOption action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { SelectShippingOption, SelectShippingOptionParams, SelectShippingOptionResponse } from './types';

export const selectShippingOption: SelectShippingOption = async (
  params: SelectShippingOptionParams,
): Promise<SelectShippingOptionResponse> => {
  return await commandFrameClient.call<SelectShippingOptionParams, SelectShippingOptionResponse>(
    'selectShippingOption',
    params,
  );
};
