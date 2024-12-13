import "../styles/globals.css";

// INTERNAL IMPORT

import { TrackingProvider } from "../Conetxt/Tracking";
import { PharmaProvider } from "../Context/PharmaContext";
import { NavBar, Footer } from "../Components";
export default function App({ Component, pageProps }) {
  return (
    <>
      <TrackingProvider>
        <PharmaProvider>
          <NavBar/>
          <Component {...pageProps} />
        </PharmaProvider>
      </TrackingProvider>
      <Footer/>
    </>
  );
}
