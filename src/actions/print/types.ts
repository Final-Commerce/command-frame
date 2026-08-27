import type { CFActiveOrder } from "../../CommonTypes";

// Print type discriminator.
// Only `"image"` is supported. `"html"` and `"receipt"` are DEPRECATED — the
// station's print path renders a pre-rasterized image, so flows should
// rasterize their own receipt/label markup and print it via `type: "image"`
// (that is also the only path that carries multi-printer tag routing reliably).
export type PrintType = "image" | "html" | "receipt";

// Print parameters (discriminated union).
export type PrintParams =
    | {
          type: "image";
          data: { image: string };
          options?: PrintOptions;
      }
    | {
          /** @deprecated Rasterize your HTML and use `type: "image"`. The native path posts raw HTML to the shell (no html2canvas/sanitization) and PrintOptions may be dropped. */
          type: "html";
          data: { html: string };
          options?: PrintOptions;
      }
    | {
          /**
           * @deprecated Compose + rasterize your receipt and use `type: "image"`.
           * The station requires `order` (no active-order fallback), ignores
           * `globalBlockId`, and drops ALL PrintOptions (including tag routing).
           */
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
    /** @deprecated Not consumed by the runtime — paper size comes from the station's per-printer settings. */
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
