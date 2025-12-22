import { CommandFrameProvider } from "../../provider";
import { ManageProviderActions } from "./types";

export class ManageCommandFrameProvider extends CommandFrameProvider {
    constructor(actions: ManageProviderActions, options?: { origin?: string; debug?: boolean }) {
        super(options);

        // Register all actions dynamically
        (Object.keys(actions) as Array<keyof ManageProviderActions>).forEach((actionName) => {
            const handler = actions[actionName];
            // @ts-ignore
            this.register(actionName, handler);
        });
    }
}

