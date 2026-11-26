import type { GetAddressDetails, GetAddressDetailsParams, GetAddressDetailsResponse } from './types';

export const mockGetAddressDetails: GetAddressDetails = async (
  params: GetAddressDetailsParams,
): Promise<GetAddressDetailsResponse> => {
  console.log('[Mock] getAddressDetails called', params);
  return {
    success: true,
    address: { address1: '12 Water St', city: "St. John's", state: 'NL', postCode: 'A1C 1A1', country: 'CA' },
  };
};
