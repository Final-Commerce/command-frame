import { CFContextRender, CFContextManage } from "../../CommonTypes";

// Response types for different projects
export type GetContextResponseRender = CFContextRender;
export type GetContextResponseManage = CFContextManage;

// Generic response type (union of all context types)
export type GetContextResponse = CFContextRender | CFContextManage;

// Action handler type
export type GetContext = () => Promise<GetContextResponse>;
