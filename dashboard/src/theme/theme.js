
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#9575CD",
      light: "#D1C4E9",
      dark: "#673AB7",
    },
    secondary: {
      main: "#F48FB1",
    },
    background: {
      default: "#FAF8FF",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
