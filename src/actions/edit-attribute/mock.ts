import { EditAttribute, EditAttributeParams, EditAttributeResponse } from './types';
import { MOCK_ATTRIBUTES, safeSerialize } from '../../demo/database';

export const mockEditAttribute: EditAttribute = async (params: EditAttributeParams): Promise<EditAttributeResponse> => {
  console.log('[Mock] editAttribute called', params);

  const attribute = MOCK_ATTRIBUTES.find((a) => a.id === params.attributeId);
  if (!attribute) throw new Error(`Attribute not found: ${params.attributeId}`);

  if (params.optionName !== undefined) attribute.optionName = params.optionName;
  if (params.options !== undefined) attribute.options = params.options;
  attribute.updatedAt = new Date().toISOString();

  return {
    success: true,
    attribute: safeSerialize(attribute),
    timestamp: new Date().toISOString(),
  };
};
