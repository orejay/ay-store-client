import { PaletteMode, ThemeOptions } from "@mui/material";

// ── Brand tokens ─────────────────────────────────────────────────────────────
// Change these to retheme the entire app instantly.
export const brand = {
  primary: "#E8920A",   // warm amber / gold
  secondary: "#077488", // teal
  success: "#00C98D",
  error: "#EF4444",
  warning: "#F59E0B",
};

// ── Full theme factory ────────────────────────────────────────────────────────
export const createAppTheme = (mode: PaletteMode): ThemeOptions => {
  const light = mode === "light";

  return {
    palette: {
      mode,
      primary: { main: brand.primary, contrastText: "#FFFFFF" },
      secondary: { main: brand.secondary, contrastText: "#FFFFFF" },
      success: { main: brand.success },
      error: { main: brand.error },
      warning: { main: brand.warning },
      background: {
        default: light ? "#FFFFFF" : "#0C0C0E",
        paper: light ? "#F8F9FC" : "#16161A",
      },
      text: {
        primary: light ? "#0A0A0A" : "#EFEFEF",
        secondary: light ? "#6B7280" : "#9CA3AF",
        disabled: light ? "#D1D5DB" : "#4B5563",
      },
      divider: light ? "#EBEBEB" : "#27272E",
      action: {
        hover: light ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
        selected: light ? "rgba(232,146,10,0.08)" : "rgba(232,146,10,0.14)",
      },
    },

    typography: {
      fontFamily: "Nunito, Playfair Display, Arial, sans-serif",
      h1: { fontFamily: "Playfair Display", fontWeight: 900, letterSpacing: "-0.02em" },
      h2: { fontFamily: "Playfair Display", fontWeight: 700, letterSpacing: "-0.01em" },
      h3: { fontFamily: "Playfair Display", fontWeight: 700 },
      h4: { fontFamily: "Playfair Display", fontWeight: 700 },
      h5: { fontFamily: "Playfair Display", fontWeight: 600 },
      h6: { fontFamily: "Nunito", fontWeight: 700 },
      subtitle1: { fontFamily: "Nunito", fontWeight: 600 },
      subtitle2: { fontFamily: "Nunito", fontWeight: 600 },
      body1: { fontFamily: "Nunito" },
      body2: { fontFamily: "Nunito" },
      button: { fontFamily: "Nunito", fontWeight: 700, textTransform: "none" },
      caption: { fontFamily: "Nunito" },
      overline: { fontFamily: "Nunito", fontWeight: 700, letterSpacing: "0.1em" },
    },

    shape: { borderRadius: 10 },

    shadows: [
      "none",
      light ? "0 1px 2px rgba(0,0,0,0.06)" : "0 1px 2px rgba(0,0,0,0.3)",
      light ? "0 2px 6px rgba(0,0,0,0.08)" : "0 2px 6px rgba(0,0,0,0.4)",
      light ? "0 4px 16px rgba(0,0,0,0.08)" : "0 4px 16px rgba(0,0,0,0.4)",
      light ? "0 8px 24px rgba(0,0,0,0.10)" : "0 8px 24px rgba(0,0,0,0.5)",
      light ? "0 12px 32px rgba(0,0,0,0.10)" : "0 12px 32px rgba(0,0,0,0.5)",
      ...Array(19).fill("none"),
    ] as ThemeOptions["shadows"],

    components: {
      // ── Button ──────────────────────────────────────────────────────────────
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 100,
            textTransform: "none",
            fontFamily: "Nunito",
            fontWeight: 700,
            fontSize: "0.9rem",
            letterSpacing: "0.01em",
            transition: "all 0.2s ease",
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${brand.primary} 0%, #D4800A 100%)`,
            "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
          },
          outlinedPrimary: {
            borderWidth: "1.5px",
            "&:hover": { borderWidth: "1.5px", backgroundColor: `${brand.primary}12` },
          },
          outlinedSecondary: {
            borderWidth: "1.5px",
            "&:hover": { borderWidth: "1.5px" },
          },
        },
      },

      // ── IconButton ──────────────────────────────────────────────────────────
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease",
            borderRadius: 10,
            "&:hover": { transform: "scale(1.05)" },
          },
        },
      },

      // ── Paper / Card ────────────────────────────────────────────────────────
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            borderRadius: 12,
            border: light ? "1px solid #EBEBEB" : "1px solid #27272E",
          },
          elevation1: {
            boxShadow: light ? "0 2px 8px rgba(0,0,0,0.07)" : "0 2px 8px rgba(0,0,0,0.4)",
          },
          elevation2: {
            boxShadow: light ? "0 4px 16px rgba(0,0,0,0.08)" : "0 4px 16px rgba(0,0,0,0.5)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            backgroundImage: "none",
            border: light ? "1px solid #EBEBEB" : "1px solid #27272E",
            boxShadow: light ? "0 2px 8px rgba(0,0,0,0.06)" : "0 2px 8px rgba(0,0,0,0.35)",
            transition: "box-shadow 0.25s ease, transform 0.25s ease",
            "&:hover": {
              boxShadow: light ? "0 8px 24px rgba(0,0,0,0.10)" : "0 8px 24px rgba(0,0,0,0.5)",
              transform: "translateY(-2px)",
            },
          },
        },
      },

      // ── Chip ────────────────────────────────────────────────────────────────
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 100,
            fontFamily: "Nunito",
            fontWeight: 700,
            fontSize: "0.75rem",
          },
        },
      },

      // ── TextField / Input ───────────────────────────────────────────────────
      MuiInputBase: {
        styleOverrides: {
          root: { fontFamily: "Nunito" },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: brand.primary,
              borderWidth: 2,
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined" },
      },

      // ── Slider ──────────────────────────────────────────────────────────────
      MuiSlider: {
        styleOverrides: {
          root: { color: brand.primary },
          thumb: {
            width: 16,
            height: 16,
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0 0 0 8px ${brand.primary}30`,
            },
          },
        },
      },

      // ── Divider ─────────────────────────────────────────────────────────────
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: light ? "#EBEBEB" : "#27272E" },
        },
      },

      // ── Tooltip ─────────────────────────────────────────────────────────────
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontFamily: "Nunito",
            borderRadius: 6,
            fontSize: "0.78rem",
            backgroundColor: light ? "#0A0A0A" : "#F0F0F5",
            color: light ? "#FFFFFF" : "#0A0A0A",
          },
        },
      },

      // ── Switch ──────────────────────────────────────────────────────────────
      MuiSwitch: {
        styleOverrides: {
          root: { padding: 6 },
          track: { borderRadius: 100, opacity: 0.3 },
          thumb: { borderRadius: 100 },
          switchBase: {
            "&.Mui-checked": { color: brand.primary },
            "&.Mui-checked + .MuiSwitch-track": {
              backgroundColor: brand.primary,
              opacity: 0.5,
            },
          },
        },
      },

      // ── CssBaseline ─────────────────────────────────────────────────────────
      MuiCssBaseline: {
        styleOverrides: `
          *, *::before, *::after { box-sizing: border-box; }
          ::selection { background: ${brand.primary}40; }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb {
            background: ${light ? "#D1D5DB" : "#3F3F46"};
            border-radius: 100px;
          }
          ::-webkit-scrollbar-thumb:hover { background: ${brand.primary}; }
          html { scroll-behavior: smooth; }
          a { text-decoration: none; color: inherit; }
        `,
      },
    },
  };
};

// Legacy export so old imports don't break during migration
export const themeSettings = () => ({
  primary: { main: brand.primary },
  secondary: { main: brand.secondary },
  background: { default: "#FFFFFF" },
  warning: { main: brand.warning },
  success: { main: brand.success },
});
