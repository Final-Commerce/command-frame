import type { OpenExtensionOverlay } from "./types";

export const mockOpenExtensionOverlay: OpenExtensionOverlay = (): Promise<boolean> => Promise.resolve(true);
