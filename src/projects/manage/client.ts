import { CommandFrameClient } from "../../client";
import { MANAGE_MOCKS } from "./mocks";

export class ManageClient extends CommandFrameClient {
    constructor(options: { timeout?: number; origin?: string; debug?: boolean; mockMode?: boolean } = {}) {
        super({
            ...options,
            // Cast MANAGE_MOCKS to the generic Record<string, MockHandler> expected by CommandFrameClient
            // This is safe because MANAGE_MOCKS implements ManageProviderActions where values are functions returning promises
            mockRegistry: MANAGE_MOCKS as unknown as Record<string, (params?: any) => Promise<any>>
        });
    }
}

// Singleton instance
export const manageClient = new ManageClient({
    debug: typeof window !== "undefined" && (window as any).__POSTMESSAGE_DEBUG__ === true
});
