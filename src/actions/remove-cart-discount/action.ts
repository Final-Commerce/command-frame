import { commandFrameClient } from "../../client";
import type {
    RemoveCartDiscount,
    RemoveCartDiscountResponse
} from "./types";

export const removeCartDiscount: RemoveCartDiscount = async (): Promise<RemoveCartDiscountResponse> => {
    return await commandFrameClient.call<undefined, RemoveCartDiscountResponse>("removeCartDiscount", undefined);
};