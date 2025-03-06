import { useEffect, useRef } from "react";
import "locomotive-scroll/dist/locomotive-scroll.css";

export default function useLocomotiveScroll(scrollRef) {
  // Reference to store the Locomotive Scroll instance
  const locomotiveScrollRef = useRef(null);

  // Track if component is mounted
  const isMounted = useRef(false);

  // Set mounted flag on initial render
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Initialize Locomotive Scroll
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return;

    // Dynamically import Locomotive Scroll only on the client side
    const LocomotiveScroll = require("locomotive-scroll").default;

    if (!scrollRef || !scrollRef.current || !isMounted.current) return;

    // Add a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (!isMounted.current || !scrollRef.current) return;

      try {
        // Initialize Locomotive Scroll
        locomotiveScrollRef.current = new LocomotiveScroll({
          el: scrollRef.current,
          smooth: true,
          smoothMobile: true,
          lerp: 0.1, // Linear interpolation, lower = smoother
          multiplier: 1.0, // Scroll speed multiplier
          smartphone: {
            smooth: true,
          },
          tablet: {
            smooth: true,
          },
        });

        // Update scroll on page load
        locomotiveScrollRef.current.update();

        // Set body height to match scroll container
        const height = scrollRef.current.getBoundingClientRect().height;
        document.body.style.height = `${height}px`;
      } catch (error) {
        console.error("Error initializing Locomotive Scroll:", error);
      }
    }, 200);

    // Cleanup function
    return () => {
      clearTimeout(timer);

      if (locomotiveScrollRef.current) {
        // Destroy Locomotive Scroll instance
        locomotiveScrollRef.current.destroy();
        locomotiveScrollRef.current = null;
      }

      // Reset body height
      try {
        document.body.style.height = "";
      } catch (error) {
        console.error("Error resetting body height:", error);
      }
    };
  }, [scrollRef]);

  // Handle resize events
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return;

    if (!locomotiveScrollRef.current) return;

    const handleResize = () => {
      if (
        !isMounted.current ||
        !locomotiveScrollRef.current ||
        !scrollRef.current
      )
        return;

      try {
        // Update Locomotive Scroll on resize
        locomotiveScrollRef.current.update();

        // Update body height
        const height = scrollRef.current.getBoundingClientRect().height;
        document.body.style.height = `${height}px`;
      } catch (error) {
        console.error("Error updating on resize:", error);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollRef]);

  return locomotiveScrollRef;
}
