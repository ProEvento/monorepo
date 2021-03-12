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

  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });
  return (
    <UserProvider user={user}>
      <ThemeProvider theme={darkTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  );
}
