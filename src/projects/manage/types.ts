import type {
    GetContext,
    GetFinalContext,
    GenerateAPIKey
} from "../../index";

export interface ManageProviderActions {
    getContext: GetContext;
    getFinalContext: GetFinalContext;
    generateAPIKey: GenerateAPIKey;
}

