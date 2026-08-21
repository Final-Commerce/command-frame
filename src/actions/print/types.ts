import type { CFActiveOrder } from "../../CommonTypes";

// Print type discriminator
export type PrintType = "image" | "html" | "receipt";

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
          type: "receipt";
          data: { order?: Omit<CFActiveOrder, "_id">; globalBlockId?: string };
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
    /**
     * Routing tag for multi-printer stations (FI-7113): names the print CATEGORY
     * (e.g. "receipt", "kitchen"), never a printer. The station maps tags to its
     * connected printers; at print time the host resolves the tag and prints to
     * every matched printer at that printer's own paper size/margins. Declare the
     * flow's tag set in flow-settings (`print.tags`) so the station can offer them
     * for mapping. Untagged prints keep the station's default behavior.
     */
    tag?: string;
}

// Print response
export interface PrintResponse {
    success: boolean;
    timestamp: string;
    type: PrintType;
}

// Print function type
export type Print = (params?: PrintParams) => Promise<PrintResponse>;
