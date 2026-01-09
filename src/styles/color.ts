// Nhóm 9 - IE307.Q12
export interface ThemeColors {
    primary_color: string;
    secondary_color: string;
    primary_text: string;
    primary_text_constrast: string;
    background: string;
    background_contrast: string; 
    intro_nav_dot: string;
    buttonColor: string;
    logoBg: string;
    introDis: string;
    placeholder_text: string;
    icon: string;
    border: string;
}

export const AppLightColor: ThemeColors = {
    primary_color: "#FF6967",
    secondary_color: "#FFE1E3",
    primary_text: "#000000",
    primary_text_constrast: "#FFFFFF",
    background: "#FFFFFF",
    background_contrast: "#ffffffff",
    intro_nav_dot: "#6f6e6eff",
    buttonColor: "#152cffff",
    logoBg: "#2e2e2eff",
    introDis: "#2b2b2b53",
    placeholder_text: "#737373ff",
    icon: "#374151",
    border: "#E5E7EB"
};

export const AppDarkColor: ThemeColors = {
    primary_color: "#FF6967", 
    secondary_color: "#3A1D1E", 
    primary_text: "#FFFFFF",
    primary_text_constrast: "#FFFFFF",
    background: "#111827", 
    background_contrast: "#1F2937", 
    intro_nav_dot: "#9CA3AF",
    buttonColor: "#152cffff",
    logoBg: "#2e2e2eff",
    introDis: "#E5E7EB",
    placeholder_text: "#9CA3AF",
    icon: "#D1D5DB",
    border: "#374151"
};