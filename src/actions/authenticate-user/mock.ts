import { AuthenticateUser, AuthenticateUserParams, AuthenticateUserResponse } from './types';

export const mockAuthenticateUser: AuthenticateUser = async (
  params?: AuthenticateUserParams,
): Promise<AuthenticateUserResponse> => {
  console.log('[Mock] authenticateUser called', params);

  // Headless path requires both userId and pin together (mirrors the handler guard).
  if ((params?.userId || params?.pin) && !(params?.userId && params?.pin)) {
    throw new Error('userId and pin must be provided together');
  }

  return {
    success: true,
    roleIds: params?.roleIds || [],
    timestamp: new Date().toISOString(),
  };
};
