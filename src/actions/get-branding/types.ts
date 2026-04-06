// Get Branding Types (Manage host extension)

export type BorderRadiusPreset = "sharp" | "soft" | "round" | "pill";

export interface GetBrandingResponse {
    theme: "light" | "dark";
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        destructive: string;
        sidebar: string;
        background: string;
        foreground: string;
        muted: string;
        border: string;
    };
    borderRadius: BorderRadiusPreset;
    borderRadiusValue: string;
    font: {
        family: string;
    };
    logo: string | null;
    timestamp: string;
}

export type GetBranding = () => Promise<GetBrandingResponse>;
