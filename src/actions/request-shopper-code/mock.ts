import type { RequestShopperCode, RequestShopperCodeParams, RequestShopperCodeResponse } from './types';

export const mockRequestShopperCode: RequestShopperCode = async (
  params: RequestShopperCodeParams,
): Promise<RequestShopperCodeResponse> => {
  console.log('[Mock] requestShopperCode called', params);
  return { success: true, message: `We sent a 6-digit code to ${params.email}` };
};
