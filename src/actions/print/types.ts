import type { CFActiveOrder } from "../../CommonTypes";

// Print type discriminator
export type PrintType = "image" | "html" | "selector" | "receipt";

// Print parameters (discriminated union)
export type PrintParams =
    | {
          type: "image";
          data: { image: string };
          options?: PrintOptions;
      }
    | {
          type: "html";
          data: { html: string };
          options?: PrintOptions;
      }
    | {
          type: "selector";
          data: { selector: string };
          options?: PrintOptions;
      }
    | {
          type: "receipt";
          data: { order: Omit<CFActiveOrder, "_id">; globalBlockId?: string };
          options?: PrintOptions;
      };

// Optional print settings
export interface PrintOptions {
    margins?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    paperSize?: string;
    width?: string;
}

// Print response
export interface PrintResponse {
    success: boolean;
    timestamp: string;
    type: PrintType;
}

// Print function type
export type Print = (params?: PrintParams) => Promise<PrintResponse>;
