import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0'
import '@styles/globals.css'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

export default function App({ Component, pageProps }: AppProps): React.ReactElement<AppProps> {
  const { user } = pageProps;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const theme = createMuiTheme({
    typography: {
      button: {
        textTransform: 'none',
        background: 'var(--bg)',
        color: 'var(--fg)'
      }
    },
    overrides: {
      MuiListItem: {
        root: {
          "&$selected": {
            backgroundColor: "var(--button)",
            "&:hover": {
              backgroundColor: "var(--button)",
            },
          },
        },
        button: {
          "&:hover": {
            backgroundColor: "var(--button)",
          },
        },
      },
    },
    palette: {
      // type: 'dark',
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <UserProvider user={user}>
          <Component {...pageProps} />
      </UserProvider>
    </ThemeProvider>

  );
}
