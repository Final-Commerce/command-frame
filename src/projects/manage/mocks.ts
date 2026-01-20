import { mockGetContext } from "../../actions/get-context/mock";
import { mockGetFinalContext } from "../../actions/get-final-context/mock";
import { mockGetPublicKey } from "../../actions/get-public-key/mock";
import { ManageProviderActions } from "./types";

export const MANAGE_MOCKS: ManageProviderActions = {
    getContext: mockGetContext,
    getFinalContext: mockGetFinalContext,
    getPublicKey: mockGetPublicKey
};

