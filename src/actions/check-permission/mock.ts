import { CheckPermission, CheckPermissionParams, CheckPermissionResponse } from './types';

/**
 * Standalone mock: `allowed: true` for every permission EXCEPT the magic name
 * `'mock_denied'`, which returns `allowed: false` — so flows can exercise both
 * UI branches outside the iframe. The runtime answers from the hydrated
 * active user's role instead.
 */
export const mockCheckPermission: CheckPermission = async (
  params: CheckPermissionParams,
): Promise<CheckPermissionResponse> => {
  console.log('[Mock] checkPermission called', params);

  if (!params?.permission) {
    throw new Error('permission is required');
  }

  return {
    success: true,
    permission: params.permission,
    allowed: params.permission !== 'mock_denied',
    timestamp: new Date().toISOString(),
  };
};
