import { AddAttribute, AddAttributeParams, AddAttributeResponse } from './types';
import { CFAttribute } from '../../CommonTypes';
import { MOCK_ATTRIBUTES, MOCK_COMPANY, safeSerialize } from '../../demo/database';

export const mockAddAttribute: AddAttribute = async (params: AddAttributeParams): Promise<AddAttributeResponse> => {
  console.log('[Mock] addAttribute called', params);

  const now = new Date().toISOString();
  const attribute: CFAttribute = {
    id: params._id || 'mock_attribute_' + Date.now(),
    companyId: MOCK_COMPANY.id!,
    createdAt: now,
    updatedAt: now,
    optionName: params.optionName,
    sortingOrder: params.sortingOrder ?? 0,
    options: params.options,
  };

  MOCK_ATTRIBUTES.push(attribute);

  return {
    success: true,
    attribute: safeSerialize(attribute),
    timestamp: now,
  };
};
