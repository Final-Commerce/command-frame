// Toggle Slide Out Types
export interface ToggleSlideOutParams {
    slideOutId: string;
}

export interface ToggleSlideOutResponse {
    success: boolean;
    slideOutId: string;
    timestamp: string;
}

export type ToggleSlideOut = (params?: ToggleSlideOutParams) => Promise<ToggleSlideOutResponse>;

