import { CommandFrameProvider } from "../../provider";
import { RenderProviderActions } from "./types";

export class RenderCommandFrameProvider extends CommandFrameProvider<Partial<RenderProviderActions>> {
    constructor(actions: Partial<RenderProviderActions>, options?: { origin?: string; debug?: boolean }) {
        super(actions, options);
    }
}

