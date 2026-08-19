export interface CFImageAttachment {
  _id: string;
  name: string;
  url: string;
}

export interface GetImagesResponse {
  success: boolean;
  images: CFImageAttachment[];
  timestamp: string;
}

export type GetImages = () => Promise<GetImagesResponse>;
