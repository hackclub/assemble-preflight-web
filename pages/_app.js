import "../styles/globals.css";
import theme from "../lib/theme";
import Meta from "../components/meta";
import { ThemeProvider } from "theme-ui";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
