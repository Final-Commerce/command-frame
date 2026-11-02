import { CommandFrameClient } from "../../client";
import { ACTION_LABEL_COMMANDS } from "./action-labels";
import { RENDER_MOCKS } from "./mocks";
import { RenderProviderActions } from "./types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging -- typed command methods via declaration merging
export interface RenderClient extends RenderProviderActions {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class RenderClient extends CommandFrameClient {
    constructor(
        options: {
            timeout?: number;
            origin?: string;
            debug?: boolean;
            mockMode?: boolean;
            mockRegistry?: Partial<RenderProviderActions>;
        } = {}
    ) {
        const { mockRegistry: mockRegistryOverrides, ...baseOptions } = options;
        super({
            ...baseOptions,
            mockRegistry: {
                ...RENDER_MOCKS,
                ...mockRegistryOverrides
            } as unknown as Record<string, (params?: any) => Promise<any>>
        });
    }
}

export const renderClient = new RenderClient({
    debug: typeof window !== "undefined" && (window as any).__POSTMESSAGE_DEBUG__ === true
});

/** Tells page readers (the Flow Gate test) which commands this build expects a data-final-action label for. */
if (typeof window !== "undefined") {
    (window as any).__COMMAND_FRAME__ = { actionLabelCommands: ACTION_LABEL_COMMANDS };
}
