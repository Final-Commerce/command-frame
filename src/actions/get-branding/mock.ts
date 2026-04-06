import { GetBranding, GetBrandingResponse } from "./types";

export const mockGetBranding: GetBranding = async (): Promise<GetBrandingResponse> => {
    console.log("[Mock] getBranding called");

    return {
        theme: "light",
        colors: {
            primary: "#2563eb",
            secondary: "#64748b",
            accent: "#0ea5e9",
            destructive: "#dc2626",
            sidebar: "#1e293b",
            background: "#ffffff",
            foreground: "#0f172a",
            muted: "#f1f5f9",
            border: "#e2e8f0"
        },
        borderRadius: "round",
        borderRadiusValue: "0.5rem",
        font: {
            family: "system-ui, sans-serif"
        },
        logo: null,
        timestamp: new Date().toISOString()
    };
};
