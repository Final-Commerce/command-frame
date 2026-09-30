/**
 * Assign order user action
 * Calls the assignOrderUser action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { AssignOrderUser, AssignOrderUserParams, AssignOrderUserResponse } from './types';

export const assignOrderUser: AssignOrderUser = async (
  params: AssignOrderUserParams,
): Promise<AssignOrderUserResponse> => {
  return await commandFrameClient.call<AssignOrderUserParams, AssignOrderUserResponse>('assignOrderUser', params);
};
