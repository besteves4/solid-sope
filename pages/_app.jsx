import { SessionProvider } from "@inrupt/solid-ui-react";

import "../styles/app.css";

function App({ Component, pageProps }) {
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

export default App;
