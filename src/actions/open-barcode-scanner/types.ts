// Open Barcode Scanner Types
export interface OpenBarcodeScannerResponse {
  success: boolean;
  timestamp: string;
}

export type OpenBarcodeScanner = () => Promise<OpenBarcodeScannerResponse>;
