import { CommandFrameProvider } from "../../provider";
import { RenderProviderActions } from "./types";

export class RenderCommandFrameProvider extends CommandFrameProvider<RenderProviderActions> {
    constructor(actions: RenderProviderActions, options?: { origin?: string; debug?: boolean }) {
        super(actions, options);
    }
}

