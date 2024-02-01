// theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark", // Set to 'dark' for permanent dark mode
    useSystemColorMode: false,
  },
});

export default theme;
