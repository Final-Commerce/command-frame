import { CANADA_PROVINCES, listCountries } from '@final-commerce/common';

import type { GetAddressOptions, GetAddressOptionsParams, GetAddressOptionsResponse } from './types';

/** Standalone mock: the same country and province lists the runtime serves. The demo store is in Canada. */
export const mockGetAddressOptions: GetAddressOptions = async (
  params?: GetAddressOptionsParams,
): Promise<GetAddressOptionsResponse> => {
  console.log('[Mock] getAddressOptions called', params);
  const french = params?.locale?.toLowerCase().startsWith('fr') ?? false;
  const provinces = CANADA_PROVINCES.map((p) => ({ code: p.code, name: french ? p.nameFr : p.name }));
  return {
    countries: listCountries(params?.locale ?? 'en').map((c) => ({
      ...c,
      provinces: c.code === 'CA' ? provinces : [],
    })),
    defaultCountry: 'CA',
    timestamp: new Date().toISOString(),
  };
};
