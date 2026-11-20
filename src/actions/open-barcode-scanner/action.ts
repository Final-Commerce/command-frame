/**
 * Open barcode scanner action
 * Asks the host to open the device's camera barcode scanner
 */

import { commandFrameClient } from '../../client';
import type { OpenBarcodeScanner, OpenBarcodeScannerResponse } from './types';

export const openBarcodeScanner: OpenBarcodeScanner = async (): Promise<OpenBarcodeScannerResponse> => {
  return await commandFrameClient.call<undefined, OpenBarcodeScannerResponse>('openBarcodeScanner', undefined);
};
