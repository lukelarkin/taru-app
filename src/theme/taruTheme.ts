// src/theme/taruTheme.ts
export const taruColors = {
  // pulled from your logo aesthetic
  bg: "#0A0A0C",                // near‑black, slightly warm
  surface: "#121217",           // cards/sheets
  surfaceAlt: "#171823",        // elevated cards
  textPrimary: "#EAEAF2",
  textSecondary: "#B6B7C9",
  textMuted: "#8A8DA7",

  // Neon spectrum (phoenix → chain)
  neonPink: "#FF3EA5",
  neonMagenta: "#FF00B8",
  neonPurple: "#7C3AED",
  neonBlue: "#22D3EE",
  neonCyan: "#00E7FF",
  neonOrange: "#FF8A3D",

  // States
  success: "#22C55E",
  warning: "#F59E0B",
  danger:  "#EF4444",
  info:    "#38BDF8",

  // Borders
  line: "#262738",
  lineSoft: "#1C1D2A",
};

export const taruGradients = {
  phoenix: [ "#FF00B8", "#7C3AED", "#22D3EE", "#00E7FF", "#FF8A3D" ],
  chain: [ "#22D3EE", "#FF8A3D" ],
  pulse: [ "#7C3AED", "#22D3EE" ],
};

export const taruRadii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const taruSpace = {
  xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32,
};

export const taruShadow = {
  // subtle ambient
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  // neon outer glow (use with brand hues)
  glow: (hex: string, radius = 20) => ({
    shadowColor: hex,
    shadowOpacity: 0.6,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: 0 },
  }),
  // soft top light (header)
  rimLight: {
    shadowColor: "#22D3EE",
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -6 },
  },
};

export const taruOpacity = {
  disabled: 0.5,
  pressed: 0.85,
};
