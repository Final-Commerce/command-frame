import { UploadImage, UploadImageParams, UploadImageResponse } from './types';
import { MOCK_IMAGES } from '../../demo/database';

// Mock mode has no real resize pipeline, so cap the inline data: URL echo —
// large buffers would blow up the in-memory mock database.
const MAX_INLINE_BYTES = 1024 * 1024; // 1MB

const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const mockUploadImage: UploadImage = async (params: UploadImageParams): Promise<UploadImageResponse> => {
  console.log('[Mock] uploadImage called', params.file.name, params.file.mimeType);

  const { data, name, mimeType } = params.file;
  const url =
    data.byteLength > MAX_INLINE_BYTES
      ? `https://example.com/images/mock/${encodeURIComponent(name)}`
      : `data:${mimeType};base64,${bufferToBase64(data)}`;

  const timestamp = new Date().toISOString();

  const attachmentId = 'mock_image_' + Date.now();
  MOCK_IMAGES.push({ _id: attachmentId, name, url });

  return {
    success: true,
    attachmentId,
    url,
    name,
    mimeType,
    timestamp,
  };
};
