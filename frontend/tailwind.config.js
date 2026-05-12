/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
      extend: {
          "colors": {
              "on-error-container": "#93000a",
              "tertiary-fixed": "#ffddb6",
              "on-tertiary-fixed": "#2a1800",
              "background": "#fff8f6",
              "surface-container-low": "#fdf1ee",
              "secondary-container": "#e5e2df",
              "on-surface": "#201a19",
              "surface-container-highest": "#ebe0dd",
              "on-tertiary-container": "#a97b3d",
              "on-secondary-container": "#666462",
              "surface-bright": "#fff8f6",
              "tertiary-fixed-dim": "#f3bd78",
              "tertiary-container": "#2a1800",
              "on-surface-variant": "#4e4542",
              "surface-variant": "#ebe0dd",
              "outline-variant": "#d2c3c0",
              "tertiary": "#000000",
              "surface-container": "#f7ebe9",
              "on-tertiary-fixed-variant": "#633f03",
              "secondary-fixed": "#e5e2df",
              "primary-fixed": "#f2ded9",
              "surface-container-high": "#f1e6e3",
              "outline": "#807571",
              "on-error": "#ffffff",
              "on-tertiary": "#ffffff",
              "inverse-primary": "#d6c2bd",
              "on-primary-container": "#91807c",
              "primary": "#000000",
              "on-background": "#201a19",
              "on-primary-fixed-variant": "#514440",
              "primary-container": "#241916",
              "on-primary": "#ffffff",
              "surface": "#fff8f6",
              "inverse-surface": "#352f2d",
              "on-secondary": "#ffffff",
              "primary-fixed-dim": "#d6c2bd",
              "on-primary-fixed": "#241916",
              "secondary": "#605e5c",
              "error-container": "#ffdad6",
              "secondary-fixed-dim": "#c9c6c3",
              "surface-dim": "#e3d8d5",
              "inverse-on-surface": "#faeeeb",
              "error": "#ba1a1a",
              "on-secondary-fixed-variant": "#484745",
              "on-secondary-fixed": "#1c1b1a",
              "surface-tint": "#6a5b57",
              "surface-container-lowest": "#ffffff"
          },
          "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
          },
          "spacing": {
              "container-margin": "24px",
              "unit": "8px",
              "gutter": "16px",
              "touch-target": "48px"
          },
          "fontFamily": {
              "body-md": ["Inter"],
              "label-lg": ["Inter"],
              "body-lg": ["Inter"],
              "headline-lg": ["Montserrat"],
              "label-sm": ["Inter"],
              "headline-xl": ["Montserrat"],
              "headline-md": ["Montserrat"],
              "headline-lg-mobile": ["Montserrat"]
          },
          "fontSize": {
              "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
              "label-lg": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600" }],
              "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
              "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
              "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "500" }],
              "headline-xl": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
              "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
              "headline-lg-mobile": ["28px", { "lineHeight": "34px", "fontWeight": "600" }]
          }
      }
  },
  plugins: [],
}
