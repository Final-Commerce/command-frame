import type {
    GetContext,
    GetFinalContext,
    GetPublicKey
} from "../../index";

export interface ManageProviderActions {
    getContext: GetContext;
    getFinalContext: GetFinalContext;
    getPublicKey: GetPublicKey;
}

