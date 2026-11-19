import { OpenBarcodeScanner, OpenBarcodeScannerResponse } from './types';

export const mockOpenBarcodeScanner: OpenBarcodeScanner = async (): Promise<OpenBarcodeScannerResponse> => {
  console.log('[Mock] openBarcodeScanner called');

  return {
    success: true,
    timestamp: new Date().toISOString(),
  };
};
