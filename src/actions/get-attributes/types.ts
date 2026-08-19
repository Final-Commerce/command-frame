import { CFAttribute } from '../../CommonTypes';

export interface GetAttributesResponse {
  success: boolean;
  attributes: CFAttribute[];
  timestamp: string;
}

export type GetAttributes = () => Promise<GetAttributesResponse>;
