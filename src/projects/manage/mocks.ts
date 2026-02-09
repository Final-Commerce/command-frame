import { mockGetContext } from "../../actions/get-context/mock";
import { mockGetFinalContext } from "../../actions/get-final-context/mock";
import { mockGetSecretsKeys } from "../../actions/get-secrets-keys/mock";
import { mockGetSecretVal } from "../../actions/get-secret-val/mock";
import { mockSetSecretVal } from "../../actions/set-secret-val/mock";
import { ManageProviderActions } from "./types";

export const MANAGE_MOCKS: ManageProviderActions = {
    getContext: mockGetContext,
    getFinalContext: mockGetFinalContext,
    getSecretsKeys: mockGetSecretsKeys,
    getSecretVal: mockGetSecretVal,
    setSecretVal: mockSetSecretVal,
};

