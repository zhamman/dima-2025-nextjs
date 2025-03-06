import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation";
import TransitionProvider from "../components/TransitionProvider";
import "../styles/App.scss";
import "../styles/fonts.scss";
import "../styles/locomotive-custom.scss";
import "../styles/Navigation.scss";
import "../styles/Home.scss";
import "../styles/About.scss";
import "../styles/Works.scss";
import "../styles/Contact.scss";
import "../styles/VideoPlayer.scss";
import "../styles/Inner.scss";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [routerReady, setRouterReady] = useState(false);

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      const locomotiveScroll = new LocomotiveScroll();
    })();
  }, []);
  // Handle router ready state
  useEffect(() => {
    if (router.isReady) {
      setRouterReady(true);
    }
  }, [router.isReady]);

  // Import locomotive-scroll CSS only on the client side
  useEffect(() => {
    import("locomotive-scroll/dist/locomotive-scroll.css");
  }, []);

  // Prevent page refresh on first navigation
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  // Only render when router is ready
  if (!routerReady) {
    return null;
  }

  return (
    <>
      <Navigation />
      <TransitionProvider>
        <Component {...pageProps} />
      </TransitionProvider>
      <div className="grain"></div>
    </>
  );
}

export default MyApp;
