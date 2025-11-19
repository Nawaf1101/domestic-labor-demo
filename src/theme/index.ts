import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#ffe5e9",
      100: "#ffb3be",
      200: "#ff8093",
      300: "#ff4d68",
      400: "#ff1a3d",
      500: "#d2092d", // Primary brand red
      600: "#a00723",
      700: "#6e0519",
      800: "#3c020f",
      900: "#0a0005",
    },
  },
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  shadows: {
    "soft": "0 2px 8px rgba(0, 0, 0, 0.08)",
    "medium": "0 4px 16px rgba(0, 0, 0, 0.12)",
    "large": "0 8px 24px rgba(0, 0, 0, 0.16)",
    "brand": "0 4px 14px rgba(210, 9, 45, 0.25)",
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
      baseStyle: {
        fontWeight: "600",
        borderRadius: "lg",
      },
      variants: {
        solid: {
          boxShadow: "brand",
          _hover: {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(210, 9, 45, 0.35)",
          },
          transition: "all 0.2s",
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "xl",
          boxShadow: "soft",
          border: "1px solid",
          borderColor: "gray.100",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          _hover: {
            boxShadow: "large",
            transform: "translateY(-4px)",
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "lg",
          border: "2px solid",
          borderColor: "gray.200",
          _focus: {
            borderColor: "brand.500",
            boxShadow: "0 0 0 3px rgba(210, 9, 45, 0.1)",
          },
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: "lg",
          border: "2px solid",
          borderColor: "gray.200",
          _focus: {
            borderColor: "brand.500",
            boxShadow: "0 0 0 3px rgba(210, 9, 45, 0.1)",
          },
        },
      },
    },
    Table: {
      variants: {
        modern: {
          th: {
            bg: "gray.50",
            fontWeight: "700",
            textTransform: "uppercase",
            fontSize: "xs",
            letterSpacing: "wider",
            color: "gray.600",
            borderBottom: "2px solid",
            borderColor: "gray.200",
          },
          td: {
            borderBottom: "1px solid",
            borderColor: "gray.100",
          },
          tr: {
            _hover: {
              bg: "gray.50",
            },
          },
        },
      },
    },
  },
});

export default theme;

