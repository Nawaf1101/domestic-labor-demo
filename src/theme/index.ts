import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#e0f7fa",
      100: "#b2ebf2",
      200: "#80deea",
      300: "#4dd0e1",
      400: "#26c6da",
      500: "#00bcd4", // Primary brand teal/cyan
      600: "#00acc1",
      700: "#0097a7",
      800: "#00838f",
      900: "#006064",
    },
  },
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "gray.100",
      },
      "select, option": {
        bg: "gray.800",
        color: "gray.100",
      },
    },
  },
  shadows: {
    "soft": "0 2px 8px rgba(0, 0, 0, 0.4)",
    "medium": "0 4px 16px rgba(0, 0, 0, 0.5)",
    "large": "0 8px 24px rgba(0, 0, 0, 0.6)",
    "brand": "0 4px 14px rgba(0, 188, 212, 0.4)",
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
              boxShadow: "0 6px 20px rgba(0, 188, 212, 0.5)",
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
          borderColor: "gray.700",
          bg: "gray.800",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          _hover: {
            boxShadow: "large",
            transform: "translateY(-4px)",
            borderColor: "brand.500",
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "lg",
          border: "2px solid",
          borderColor: "gray.700",
          bg: "gray.800",
          color: "gray.100",
          _focus: {
            borderColor: "brand.500",
            boxShadow: "0 0 0 3px rgba(0, 188, 212, 0.2)",
          },
          _placeholder: {
            color: "gray.500",
          },
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: "lg",
          border: "2px solid",
          borderColor: "gray.700",
          bg: "gray.800",
          color: "gray.100",
          _focus: {
            borderColor: "brand.500",
            boxShadow: "0 0 0 3px rgba(0, 188, 212, 0.2)",
          },
        },
      },
      parts: ["field", "icon"],
      variants: {},
      defaultProps: {
        variant: null,
      },
    },
    Table: {
      variants: {
        modern: {
          th: {
            bg: "gray.800",
            fontWeight: "700",
            textTransform: "uppercase",
            fontSize: "xs",
            letterSpacing: "wider",
            color: "gray.300",
            borderBottom: "2px solid",
            borderColor: "gray.700",
          },
          td: {
            borderBottom: "1px solid",
            borderColor: "gray.700",
            color: "gray.200",
          },
          tr: {
            _hover: {
              bg: "gray.800",
            },
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        overlay: {
          bg: "blackAlpha.600",
        },
        dialog: {
          bg: "gray.800",
        },
        header: {
          color: "gray.100",
        },
        body: {
          color: "gray.200",
        },
        footer: {
          color: "gray.200",
        },
      },
    },
    FormLabel: {
      baseStyle: {
        color: "gray.200",
        fontWeight: "600",
      },
    },
    Checkbox: {
      baseStyle: {
        label: {
          color: "gray.200",
        },
      },
    },
    NumberInput: {
      baseStyle: {
        field: {
          borderRadius: "lg",
          border: "2px solid",
          borderColor: "gray.700",
          bg: "gray.800",
          color: "gray.100",
          _focus: {
            borderColor: "brand.500",
            boxShadow: "0 0 0 3px rgba(0, 188, 212, 0.2)",
          },
        },
      },
    },
    Alert: {
      baseStyle: {
        container: {
          bg: "gray.800",
          color: "gray.100",
        },
      },
    },
  },
});

export default theme;

