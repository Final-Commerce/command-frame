import { CommandFrameProvider } from "../../provider";
import { ManageProviderActions } from "./types";

export class ManageCommandFrameProvider extends CommandFrameProvider<ManageProviderActions> {
    constructor(actions: ManageProviderActions, options?: { origin?: string; debug?: boolean }) {
        super(actions, options);
    }
}

