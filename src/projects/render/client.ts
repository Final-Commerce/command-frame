import { CommandFrameClient } from "../../client";
import { RENDER_MOCKS } from "./mocks";

export class RenderClient extends CommandFrameClient {
    constructor(options: { timeout?: number; origin?: string; debug?: boolean; mockMode?: boolean } = {}) {
        super({
            ...options,
            // Cast RENDER_MOCKS to the generic Record<string, MockHandler> expected by CommandFrameClient
            // This is safe because RENDER_MOCKS implements RenderProviderActions where values are functions returning promises
            mockRegistry: RENDER_MOCKS as unknown as Record<string, (params?: any) => Promise<any>>
        });
    }
}

// Singleton instance
export const renderClient = new RenderClient({
    debug: typeof window !== "undefined" && (window as any).__POSTMESSAGE_DEBUG__ === true
});
