import type { ResolveExtensionOverlay } from "./types";

export const mockResolveExtensionOverlay: ResolveExtensionOverlay = (): Promise<{ success: boolean }> => Promise.resolve({ success: true });
