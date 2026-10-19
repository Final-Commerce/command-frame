import { commandFrameClient } from '../../client';
import type { SetVariantUnavailable, SetVariantUnavailableParams, SetVariantUnavailableResponse } from './types';

export const setVariantUnavailable: SetVariantUnavailable = async (
  params?: SetVariantUnavailableParams,
): Promise<SetVariantUnavailableResponse> => {
  return await commandFrameClient.call<SetVariantUnavailableParams, SetVariantUnavailableResponse>(
    'setVariantUnavailable',
    params,
  );
};
