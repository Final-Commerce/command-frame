import type { SearchAddresses, SearchAddressesParams, SearchAddressesResponse } from './types';

/** Standalone mock: two Water Street addresses for anything typed. */
export const mockSearchAddresses: SearchAddresses = async (
  params: SearchAddressesParams,
): Promise<SearchAddressesResponse> => {
  console.log('[Mock] searchAddresses called', params);
  if (params.query.trim().length < 3) return { success: true, available: true, suggestions: [] };
  return {
    success: true,
    available: true,
    suggestions: [
      {
        id: 'mock-place-1',
        label: "12 Water St, St. John's, NL, Canada",
        main: '12 Water St',
        secondary: "St. John's, NL, Canada",
      },
      {
        id: 'mock-place-2',
        label: "120 Water St, St. John's, NL, Canada",
        main: '120 Water St',
        secondary: "St. John's, NL, Canada",
      },
    ],
  };
};
