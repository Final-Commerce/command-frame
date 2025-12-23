import { CommandFrameClient } from "../../client";
import { RENDER_MOCKS } from "./mocks";
import { RenderProviderActions } from "./types";

export interface RenderClient extends RenderProviderActions {}

export class RenderClient extends CommandFrameClient {
    constructor(options: { timeout?: number; origin?: string; debug?: boolean; mockMode?: boolean } = {}) {
        super({
            ...options,
            mockRegistry: RENDER_MOCKS as unknown as Record<string, (params?: any) => Promise<any>>
        });
    }
}

export const renderClient = new RenderClient({
    debug: typeof window !== "undefined" && (window as any).__POSTMESSAGE_DEBUG__ === true
});
