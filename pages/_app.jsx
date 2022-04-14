import { SessionProvider } from "@inrupt/solid-ui-react";

import "./styles.css";

/* eslint react/prop-types: 0, react/jsx-props-no-spreading: 0 */
function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider
      sessionId="session-provider-example"
      onError={console.log}
      restorePreviousSession
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
