export interface UploadImageParams {
  /** The file as a transferable — postMessage moves ArrayBuffers efficiently; DOM File objects don't cross the frame boundary. */
  file: { data: ArrayBuffer; name: string; mimeType: string };
}

export interface UploadImageResponse {
  success: boolean;
  /** The hub-api attachment row's _id — what deleteImage takes to remove the upload. */
  attachmentId: string;
  /** Public (resized) URL — store THIS in product.images[] / variant.images[]. */
  url: string;
  originalUrl?: string;
  path?: string;
  name: string;
  mimeType: string;
  timestamp: string;
}

export type UploadImage = (params: UploadImageParams) => Promise<UploadImageResponse>;
