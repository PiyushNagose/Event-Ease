import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1e3a8a" }, // deep blue
    secondary: { main: "#f97316" }, // orang
    background: { default: "#f3f4f6" }, // light grey
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
