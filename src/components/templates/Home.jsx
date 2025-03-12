import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MagneticButton from "../MagneticButton";

const Home = () => {
  // Main state for the component
  const [state, setState] = useState({
    currentIndex: 0,
    isTransitioning: false,
    progress: 0,
    videosLoaded: false,
  });

  // Refs
  const videoRefs = useRef([null, null]);
  const intervalRef = useRef(null);
  const activeVideoRef = useRef(0);

  // Featured works data
  const featuredWorks = [
    {
      title: "THE WILD - BUCK MASON",
      category: "COMMERCIAL",
      videoUrl: "/videos/featured-cuts/the-wild.mp4",
    },
    {
      title: "BECKY G - OTRO CAPÍTULO",
      category: "MUSIC VIDEO",
      videoUrl: "/videos/featured-cuts/beckyg.mp4",
    },
    {
      title: "TOMA ALTY x MONOS",
      category: "COMMERCIAL",
      videoUrl: "/videos/featured-cuts/monos.mp4",
    },
    {
      title: "NANAMÉ - TOO COLD",
      category: "MUSIC VIDEO",
      videoUrl: "/videos/featured-cuts/naname-too-cold.mp4",
    },
    {
      title: "HEY BIKE HAULER",
      category: "COMMERCIAL",
      videoUrl: "/videos/featured-cuts/hey-bike-haul.mp4",
    },
    {
      title: "ANNICK NICOLI - CHEIA DE GRAÇA",
      category: "MUSIC VIDEO",
      videoUrl: "/videos/featured-cuts/annick-nicoli-raca.mp4",
    },
  ];

  // Destructure state for easier access
  const { currentIndex, isTransitioning, progress, videosLoaded } = state;

  // Get current and next video elements
  const getCurrentVideo = () => videoRefs.current[activeVideoRef.current];
  const getInactiveVideo = () =>
    videoRefs.current[activeVideoRef.current === 0 ? 1 : 0];

  // Update progress based on video time
  const updateProgress = () => {
    const video = getCurrentVideo();
    if (!video) return;

    const currentTime = video.currentTime;
    const duration = 10; // Fixed 10-second duration
    const newProgress = Math.min((currentTime / duration) * 100, 100);

    setState(prev => ({ ...prev, progress: newProgress }));

    // Auto transition after 10 seconds
    if (currentTime >= 10 && !state.isTransitioning) {
      handleVideoChange((currentIndex + 1) % featuredWorks.length);
    }
  };

  // Handle video change (manual or automatic)
  const handleVideoChange = newIndex => {
    if (newIndex === currentIndex || state.isTransitioning) return;

    // Set transitioning state
    setState(prev => ({ ...prev, isTransitioning: true }));

    const currentVideo = getCurrentVideo();
    const nextVideo = getInactiveVideo();

    // Pause current video
    currentVideo.pause();

    // Prepare next video
    nextVideo.src = featuredWorks[newIndex].videoUrl;
    nextVideo.load();

    // Play next video and handle transition
    nextVideo
      .play()
      .then(() => {
        // Reset to start of video
        nextVideo.currentTime = 0;

        // Toggle active video
        const newActiveVideo = activeVideoRef.current === 0 ? 1 : 0;
        activeVideoRef.current = newActiveVideo;

        // Update state with new index and reset transition state
        setState(prev => ({
          ...prev,
          currentIndex: newIndex,
          progress: 0,
          isTransitioning: false,
        }));
      })
      .catch(err => {
        console.error("Error playing video:", err);
        setState(prev => ({ ...prev, isTransitioning: false }));
      });
  };

  // Handle progress dot click
  const handleProgressDotClick = index => {
    if (index !== currentIndex) {
      handleVideoChange(index);
    }
  };

  // Handle arrow click
  const handleArrowClick = direction => {
    if (state.isTransitioning) return;

    const totalVideos = featuredWorks.length;
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % totalVideos;
    } else {
      newIndex = (currentIndex - 1 + totalVideos) % totalVideos;
    }

    handleVideoChange(newIndex);
  };

  // Initialize videos on component mount
  useEffect(() => {
    const firstVideo = videoRefs.current[0];
    const secondVideo = videoRefs.current[1];

    if (firstVideo) {
      firstVideo.src = featuredWorks[0].videoUrl;
      firstVideo.load();

      // Preload second video
      if (secondVideo && featuredWorks.length > 1) {
        secondVideo.src = featuredWorks[1].videoUrl;
        secondVideo.load();
      }

      // Play first video when ready
      const handleFirstVideoReady = () => {
        firstVideo.currentTime = 0;
        firstVideo
          .play()
          .then(() => {
            setState(prev => ({ ...prev, videosLoaded: true }));
          })
          .catch(err => console.error("Error playing initial video:", err));

        firstVideo.removeEventListener("canplay", handleFirstVideoReady);
      };

      firstVideo.addEventListener("canplay", handleFirstVideoReady);
    }

    // Cleanup
    return () => {
      if (firstVideo) {
        firstVideo.removeEventListener("canplay", () => {});
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Set up progress tracking
  useEffect(() => {
    if (!videosLoaded) return;

    const video = getCurrentVideo();
    if (!video) return;

    const handleTimeUpdate = () => {
      updateProgress();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videosLoaded, currentIndex, activeVideoRef.current]);

  // Handle video errors and stalls
  useEffect(() => {
    if (!videosLoaded) return;

    const video = getCurrentVideo();
    if (!video) return;

    const handleError = () => {
      console.error("Video error occurred");
      if (!state.isTransitioning) {
        handleVideoChange((currentIndex + 1) % featuredWorks.length);
      }
    };

    const handleStalled = () => {
      console.log("Video stalled, attempting to resume");
      if (!state.isTransitioning) {
        video.play().catch(err => console.error("Error resuming video:", err));
      }
    };

    video.addEventListener("error", handleError);
    video.addEventListener("stalled", handleStalled);
    video.addEventListener("waiting", handleStalled);

    return () => {
      video.removeEventListener("error", handleError);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("waiting", handleStalled);
    };
  }, [videosLoaded, currentIndex, state.isTransitioning]);

  // Text animation variants for Framer Motion
  const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="home">
      <div className="video-background">
        {/* First video element */}
        <video
          muted
          playsInline
          preload="auto"
          className={`background-video ${
            activeVideoRef.current === 0 ? "active" : "inactive"
          }`}
          ref={el => (videoRefs.current[0] = el)}
          style={{ opacity: activeVideoRef.current === 0 ? 1 : 0 }}
        />

        {/* Second video element */}
        <video
          muted
          playsInline
          preload="auto"
          className={`background-video ${
            activeVideoRef.current === 1 ? "active" : "inactive"
          }`}
          ref={el => (videoRefs.current[1] = el)}
          style={{ opacity: activeVideoRef.current === 1 ? 1 : 0 }}
        />

        <div className="overlay" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="content"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={textVariants}
          >
            <div className="content-container">
              <div className="title-section">
                <h1>
                  {featuredWorks[currentIndex].title
                    .split(" ")
                    .map((word, index) => (
                      <motion.span
                        key={index}
                        className="word"
                        variants={wordVariants}
                      >
                        {word}{" "}
                      </motion.span>
                    ))}
                </h1>
              </div>

              <div className="bottom-section">
                <div className="category">
                  {featuredWorks[currentIndex].category
                    .split(" ")
                    .map((word, index) => (
                      <motion.span
                        key={index}
                        className="word"
                        variants={wordVariants}
                      >
                        {word}{" "}
                      </motion.span>
                    ))}
                </div>
                <MagneticButton scale={0.7}>
                  <Link href="/works" className="see-more">
                    See More
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        className="counter"
        key={`counter-${currentIndex}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {`0${currentIndex + 1}`}
      </motion.div>

      <div className="navigation-container">
        <div className="navigation-arrows">
          <div
            className="arrow arrow-left"
            onClick={() => handleArrowClick("prev")}
          >
            <svg
              fill="#ffffff"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 348.692 348.692"
              xmlSpace="preserve"
              stroke="#ffffff"
              transform="rotate(0)matrix(-1, 0, 0, 1, 0, 0)"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path d="M345.649,130.289c-35.495-17.136-64.872-40.392-91.8-68.544c-3.06-3.06-6.731-2.448-9.18,0.612 c-1.224-0.612-1.836-1.224-2.448-1.224c-7.344,0-7.956,11.016-7.956,15.912c-0.611,11.016-1.224,21.42-1.224,32.436 c-63.648-0.612-127.909,0-191.557-9.792c-3.06-0.612-6.732,0.612-7.956,3.672c-0.612,0-1.836,0-2.448,0.612 c-5.508,4.284-10.404,9.18-15.3,14.076c-4.896,4.284-8.568,9.792-13.464,13.464c-3.672,3.06-2.448,6.732,0,8.568 c-0.612,23.256-1.836,45.9,1.224,69.156c0.612,6.731,10.404,7.956,12.24,3.06h0.612c59.976,5.508,122.4,6.12,182.376,2.448 c-10.403,20.196-2.447,42.84,1.225,65.484c0.611,3.672,3.06,4.896,5.508,4.283c0,3.672,3.672,6.12,6.731,3.061 c37.332-36.108,81.396-58.752,123.013-88.128c4.284-3.061,2.447-10.404-3.061-10.404c6.732-14.688,10.404-30.6,15.912-45.9 c0.612-1.836,0.612-3.672-0.611-4.896C349.322,136.409,349.322,132.125,345.649,130.289z M235.49,122.333 c3.06,0,4.896-1.836,6.119-4.284c1.837-0.612,3.673-2.448,3.673-5.508c0-9.792,1.224-19.584,2.447-29.376 c0-2.448,0.612-5.508,1.225-7.956c23.256,25.704,51.408,46.512,82.62,62.424c-14.688,15.3-30.601,28.152-47.736,40.391 c-12.852,9.181-27.54,17.137-39.78,26.929c0-0.612,0-1.224,0-1.836c0-10.404,0.612-20.808-0.611-31.212 c3.06-3.672,0.611-10.404-6.12-9.18c-63.649,8.568-125.461-2.448-189.721,1.836c-1.224-17.136-1.836-34.272-1.836-51.408 C108.805,122.945,172.454,122.945,235.49,122.333z M211.622,275.945c-3.672-21.42-11.628-45.288-3.061-66.097 c0.612-1.224,0-1.836-0.611-2.447c-0.612-1.836-2.448-3.672-5.509-3.672c-61.2-3.673-124.848-3.061-186.048,2.447h-0.612 c-2.448-21.42-4.284-43.452-4.896-64.872c0.612-0.612,1.224-1.836,1.836-3.06c1.836-5.508,6.732-11.016,10.404-15.3 c3.06-3.672,6.732-7.344,9.792-11.628c0,18.972,1.836,37.332,4.896,56.304c0.612,2.448,3.06,3.672,5.508,3.672 c0.612,1.224,1.224,1.836,3.06,1.836c58.14,5.508,130.357,23.868,187.884,4.284c-1.224,8.568-2.448,16.524-3.672,25.092 c-0.612,4.896-3.06,12.24-1.836,18.36c-1.224,3.06,0.612,6.731,4.284,6.731c2.448,1.225,5.508,0.612,7.344-1.224l0.612-0.612 c0.611,0,1.224,0,1.836,0c2.448,0,3.672-1.836,3.06-3.672c29.988-14.076,61.2-37.943,85.068-62.424 c-3.06,11.628-5.508,23.256-7.956,34.884C281.39,210.461,240.998,243.509,211.622,275.945z"></path>
                </g>
              </g>
            </svg>
          </div>

          <div className="progress-indicators">
            {featuredWorks.map((work, index) => (
              <div
                key={index}
                className={`progress-dot ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => handleProgressDotClick(index)}
              >
                {index === currentIndex && (
                  <motion.div
                    className="progress-bar"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div
            className="arrow arrow-right"
            onClick={() => handleArrowClick("next")}
          >
            <svg
              fill="#ffffff"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 348.692 348.692"
              xmlSpace="preserve"
              stroke="#ffffff"
              transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path d="M345.649,130.289c-35.495-17.136-64.872-40.392-91.8-68.544c-3.06-3.06-6.731-2.448-9.18,0.612 c-1.224-0.612-1.836-1.224-2.448-1.224c-7.344,0-7.956,11.016-7.956,15.912c-0.611,11.016-1.224,21.42-1.224,32.436 c-63.648-0.612-127.909,0-191.557-9.792c-3.06-0.612-6.732,0.612-7.956,3.672c-0.612,0-1.836,0-2.448,0.612 c-5.508,4.284-10.404,9.18-15.3,14.076c-4.896,4.284-8.568,9.792-13.464,13.464c-3.672,3.06-2.448,6.732,0,8.568 c-0.612,23.256-1.836,45.9,1.224,69.156c0.612,6.731,10.404,7.956,12.24,3.06h0.612c59.976,5.508,122.4,6.12,182.376,2.448 c-10.403,20.196-2.447,42.84,1.225,65.484c0.611,3.672,3.06,4.896,5.508,4.283c0,3.672,3.672,6.12,6.731,3.061 c37.332-36.108,81.396-58.752,123.013-88.128c4.284-3.061,2.447-10.404-3.061-10.404c6.732-14.688,10.404-30.6,15.912-45.9 c0.612-1.836,0.612-3.672-0.611-4.896C349.322,136.409,349.322,132.125,345.649,130.289z M235.49,122.333 c3.06,0,4.896-1.836,6.119-4.284c1.837-0.612,3.673-2.448,3.673-5.508c0-9.792,1.224-19.584,2.447-29.376 c0-2.448,0.612-5.508,1.225-7.956c23.256,25.704,51.408,46.512,82.62,62.424c-14.688,15.3-30.601,28.152-47.736,40.391 c-12.852,9.181-27.54,17.137-39.78,26.929c0-0.612,0-1.224,0-1.836c0-10.404,0.612-20.808-0.611-31.212 c3.06-3.672,0.611-10.404-6.12-9.18c-63.649,8.568-125.461-2.448-189.721,1.836c-1.224-17.136-1.836-34.272-1.836-51.408 C108.805,122.945,172.454,122.945,235.49,122.333z M211.622,275.945c-3.672-21.42-11.628-45.288-3.061-66.097 c0.612-1.224,0-1.836-0.611-2.447c-0.612-1.836-2.448-3.672-5.509-3.672c-61.2-3.673-124.848-3.061-186.048,2.447h-0.612 c-2.448-21.42-4.284-43.452-4.896-64.872c0.612-0.612,1.224-1.836,1.836-3.06c1.836-5.508,6.732-11.016,10.404-15.3 c3.06-3.672,6.732-7.344,9.792-11.628c0,18.972,1.836,37.332,4.896,56.304c0.612,2.448,3.06,3.672,5.508,3.672 c0.612,1.224,1.224,1.836,3.06,1.836c58.14,5.508,130.357,23.868,187.884,4.284c-1.224,8.568-2.448,16.524-3.672,25.092 c-0.612,4.896-3.06,12.24-1.836,18.36c-1.224,3.06,0.612,6.731,4.284,6.731c2.448,1.225,5.508,0.612,7.344-1.224l0.612-0.612 c0.611,0,1.224,0,1.836,0c2.448,0,3.672-1.836,3.06-3.672c29.988-14.076,61.2-37.943,85.068-62.424 c-3.06,11.628-5.508,23.256-7.956,34.884C281.39,210.461,240.998,243.509,211.622,275.945z"></path>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
