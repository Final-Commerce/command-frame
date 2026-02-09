import type {
    GetContext,
    GetFinalContext,
    GetSecretsKeys,
    GetSecretVal,
    SetSecretVal
} from "../../index";

export interface ManageProviderActions {
    getContext: GetContext;
    getFinalContext: GetFinalContext;
    getSecretsKeys: GetSecretsKeys;
    getSecretVal: GetSecretVal;
    setSecretVal: SetSecretVal;
}

