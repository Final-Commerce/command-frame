import { CFContext } from "../../CommonTypes";
export type GetContextResponse = CFContext;
export type GetContext = () => Promise<GetContextResponse>; 
