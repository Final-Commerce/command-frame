import { CommandFrameClient } from "../../client";
import { MANAGE_MOCKS } from "./mocks";
import { ManageProviderActions } from "./types";

export interface ManageClient extends ManageProviderActions {}

export class ManageClient extends CommandFrameClient {
    constructor(options: { timeout?: number; origin?: string; debug?: boolean; mockMode?: boolean } = {}) {
        super({
            ...options,
            mockRegistry: MANAGE_MOCKS as unknown as Record<string, (params?: any) => Promise<any>>
        });
    }
}

export const manageClient = new ManageClient({
    debug: typeof window !== "undefined" && (window as any).__POSTMESSAGE_DEBUG__ === true
});
