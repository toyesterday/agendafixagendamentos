export type ThemeType = "salon" | "barbershop";

export interface ThemeColors {
  primary: {
    main: string;
    light: string;
    dark: string;
    gradient: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
  };
  accent: {
    main: string;
    light: string;
  };
  background: {
    main: string;
    secondary: string;
    card: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface Theme {
  id: ThemeType;
  name: string;
  description: string;
  icon: string;
  colors: ThemeColors;
  businessType: "Salão" | "Barbearia";
}

export const themes: Record<ThemeType, Theme> = {
  salon: {
    id: "salon",
    name: "Salão Elegante",
    description: "Tema roxo e rosa para salões femininos",
    icon: "✨",
    businessType: "Salão",
    colors: {
      primary: {
        main: "#9333ea", // Purple-600
        light: "#a855f7", // Purple-500
        dark: "#7c3aed", // Purple-700
        gradient: "from-purple-600 via-pink-500 to-rose-500",
      },
      secondary: {
        main: "#ec4899", // Pink-500
        light: "#f472b6", // Pink-400
        dark: "#db2777", // Pink-600
      },
      accent: {
        main: "#f97316", // Orange-500
        light: "#fb923c", // Orange-400
      },
      background: {
        main: "#fdf4ff", // Purple-50
        secondary: "#fef7ff", // Fuchsia-50
        card: "#ffffff",
      },
      text: {
        primary: "#1f2937", // Gray-800
        secondary: "#6b7280", // Gray-500
        muted: "#9ca3af", // Gray-400
      },
      status: {
        success: "#22c55e", // Green-500
        warning: "#f59e0b", // Amber-500
        error: "#ef4444", // Red-500
        info: "#3b82f6", // Blue-500
      },
    },
  },
  barbershop: {
    id: "barbershop",
    name: "Barbearia Clássica",
    description: "Tema azul escuro, cinza e laranja para barbearias",
    icon: "✂️",
    businessType: "Barbearia",
    colors: {
      primary: {
        main: "#1e40af", // Blue-800
        light: "#3b82f6", // Blue-500
        dark: "#1e3a8a", // Blue-900
        gradient: "from-blue-800 via-slate-700 to-orange-600",
      },
      secondary: {
        main: "#64748b", // Slate-500
        light: "#94a3b8", // Slate-400
        dark: "#475569", // Slate-600
      },
      accent: {
        main: "#ea580c", // Orange-600
        light: "#f97316", // Orange-500
      },
      background: {
        main: "#f8fafc", // Slate-50
        secondary: "#f1f5f9", // Slate-100
        card: "#ffffff",
      },
      text: {
        primary: "#0f172a", // Slate-900
        secondary: "#475569", // Slate-600
        muted: "#64748b", // Slate-500
      },
      status: {
        success: "#059669", // Emerald-600
        warning: "#d97706", // Amber-600
        error: "#dc2626", // Red-600
        info: "#2563eb", // Blue-600
      },
    },
  },
};

export const getTheme = (themeType: ThemeType): Theme => {
  return themes[themeType];
};

export const getThemeClasses = (themeType: ThemeType) => {
  const theme = getTheme(themeType);

  return {
    // Primary buttons and main UI elements
    primaryButton:
      themeType === "salon"
        ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
        : "bg-gradient-to-r from-blue-800 to-slate-700 hover:from-blue-900 hover:to-slate-800",

    // Secondary buttons
    secondaryButton:
      themeType === "salon"
        ? "bg-pink-500 hover:bg-pink-600"
        : "bg-slate-500 hover:bg-slate-600",

    // Accent elements
    accent: themeType === "salon" ? "text-orange-500" : "text-orange-600",

    // Background gradients
    backgroundGradient:
      themeType === "salon"
        ? "bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500"
        : "bg-gradient-to-br from-blue-800 via-slate-700 to-orange-600",

    // Card backgrounds
    card: "bg-white",

    // Text colors
    textPrimary: themeType === "salon" ? "text-gray-800" : "text-slate-900",
    textSecondary: themeType === "salon" ? "text-gray-600" : "text-slate-600",
    textMuted: themeType === "salon" ? "text-gray-400" : "text-slate-500",

    // Status colors
    success: themeType === "salon" ? "text-green-500" : "text-emerald-600",
    warning: themeType === "salon" ? "text-amber-500" : "text-amber-600",
    error: themeType === "salon" ? "text-red-500" : "text-red-600",
    info: themeType === "salon" ? "text-blue-500" : "text-blue-600",

    // Badge colors
    primaryBadge:
      themeType === "salon"
        ? "bg-purple-100 text-purple-800 border-purple-200"
        : "bg-blue-100 text-blue-800 border-blue-200",

    // Navigation active states
    navActive:
      themeType === "salon"
        ? "bg-purple-100 text-purple-700 border border-purple-200"
        : "bg-blue-100 text-blue-700 border border-blue-200",

    // Metrics cards
    metricsCard1:
      themeType === "salon"
        ? "bg-gradient-to-br from-purple-500 to-purple-600"
        : "bg-gradient-to-br from-blue-700 to-blue-800",

    metricsCard2:
      themeType === "salon"
        ? "bg-gradient-to-br from-pink-500 to-pink-600"
        : "bg-gradient-to-br from-slate-600 to-slate-700",

    metricsCard3:
      themeType === "salon"
        ? "bg-gradient-to-br from-rose-500 to-rose-600"
        : "bg-gradient-to-br from-orange-600 to-orange-700",
  };
};
