import type { GetUsers } from "./types";

export const getUsers: GetUsers = async (params) => {
    console.log("getUsers called with params:", params);
    return {
        users: [],
        success: true,
        timestamp: new Date().toISOString(),
    };
};
