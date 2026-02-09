import type { GetRoles } from "./types";

export const getRoles: GetRoles = async (params) => {
    console.log("getRoles called with params:", params);
    return {
        roles: [],
        success: true,
        timestamp: new Date().toISOString(),
    };
};
