/**
 * Check permission action
 * Calls the checkPermission action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { CheckPermission, CheckPermissionParams, CheckPermissionResponse } from './types';

export const checkPermission: CheckPermission = async (
  params: CheckPermissionParams,
): Promise<CheckPermissionResponse> => {
  return await commandFrameClient.call<CheckPermissionParams, CheckPermissionResponse>('checkPermission', params);
};
