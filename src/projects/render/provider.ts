import { CommandFrameProvider } from "../../provider";
import { RenderProviderActions } from "./types";

export class RenderCommandFrameProvider extends CommandFrameProvider {
    constructor(actions: RenderProviderActions, options?: { origin?: string; debug?: boolean }) {
        super(options);

        // Register all actions dynamically
        // Using Object.entries ensures we register exactly what is passed in the strict interface object
        // The Interface ensures all required keys are present.
        (Object.keys(actions) as Array<keyof RenderProviderActions>).forEach((actionName) => {
            const handler = actions[actionName];
            // @ts-ignore - TS doesn't love dynamic property access on typed methods even if safe
            this.register(actionName, handler);
        });
    }
}

