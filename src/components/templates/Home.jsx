import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { motion } from "framer-motion";
import MagneticButton from "../MagneticButton";

const Home = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedVideoIndex, setDisplayedVideoIndex] = useState(0);
  const [isHoveringDots, setIsHoveringDots] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [activeVideoElement, setActiveVideoElement] = useState(0); // 0 or 1 to toggle between two video elements
  const [lastTransitionTime, setLastTransitionTime] = useState(0); // Track when the last transition happened
  const [videosLoaded, setVideosLoaded] = useState(false); // Track if videos are loaded
  const [textVisible, setTextVisible] = useState(false); // Track text visibility state
  const progressIndicatorsRef = useRef(null);
  const videoBackgroundRef = useRef(null);
  const titleWordsRef = useRef([]);
  const categoryWordsRef = useRef([]);
  const videoRefs = useRef([null, null]); // Two video refs instead of one
  const overlayRef = useRef(null);
  const transitionTriggeredRef = useRef(false); // Use ref for transition state to avoid closure issues
  const textTimelineRef = useRef(null); // Store the text animation timeline

  // Clear refs on re-render
  titleWordsRef.current = [];
  categoryWordsRef.current = [];

  // Add to title words ref
  const addToTitleRefs = el => {
    if (el && !titleWordsRef.current.includes(el)) {
      titleWordsRef.current.push(el);
    }
  };

  // Add to category words ref
  const addToCategoryRefs = el => {
    if (el && !categoryWordsRef.current.includes(el)) {
      categoryWordsRef.current.push(el);
    }
  };

  // Example featured works - replace with your actual video URLs
  const featuredWorks = [
    {
      title: "THE WILD - BUCK MASON",
      category: "COMMERCIAL",
      videoUrl: "/videos/featured-cuts/the-wild.mp4",
    },
    {
      title: "RUSSIAN MARTIAN - LOOSING MY MIND",
      category: "MUSIC VIDEO",
      videoUrl: "/videos/featured-cuts/russian-martian-loosing-mind.mp4",
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
    // Add more works here
  ];

  // Set initial opacity to 0 for all text elements
  useEffect(() => {
    // Hide all text elements initially - use x instead of y for animations
    gsap.set(titleWordsRef.current, { x: 0, y: 0, opacity: 0 });
    gsap.set(categoryWordsRef.current, { x: 0, y: 0, opacity: 0 });
  }, []);

  // Animation for text slide in
  const animateTextIn = () => {
    if (isAnimating) return;

    const titleWords = document.querySelectorAll(".title-section .word");
    const categoryWords = document.querySelectorAll(".category .word");

    // Create a timeline for text animations
    const tl = gsap.timeline();

    // Set initial position for words - use x only, not y
    gsap.set([titleWords, categoryWords], {
      x: 150,
      opacity: 0,
      y: 0, // Ensure no vertical shift
    });

    // Animate both title and category words together
    tl.to([titleWords, categoryWords], {
      x: 0,
      opacity: 1,
      duration: 2,
      stagger: {
        each: 0.02,
        from: "start",
      },
      ease: "power2.out",
    });

    return tl;
  };

  const animateTextOut = () => {
    const titleWords = document.querySelectorAll(".title-section .word");
    const categoryWords = document.querySelectorAll(".category .word");

    // Create a timeline for text animations
    const tl = gsap.timeline();

    // Animate both title and category words together - use x only, not y
    tl.to([titleWords, categoryWords], {
      x: -150,
      opacity: 0,
      y: 0, // Ensure no vertical shift
      duration: 2,
      stagger: {
        each: 0.02,
        from: "end",
      },
      ease: "power2.inOut",
    });

    return tl;
  };

  // Animation for seamless video transition
  const animateVideoTransition = (currentVideo, nextVideo, nextIndex) => {
    return new Promise(resolve => {
      const masterTl = gsap.timeline({
        onComplete: () => {
          setActiveVideoElement(activeVideoElement === 0 ? 1 : 0);
          setDisplayedVideoIndex(nextIndex);
          setCurrentVideoIndex(nextIndex);
          transitionTriggeredRef.current = false;
          resolve();
        },
      });

      // Only do video animations
      masterTl
        .to(currentVideo, {
          opacity: 0,
          duration: 2,
          ease: "power1.inOut",
        })
        .to(
          nextVideo,
          {
            opacity: 1,
            duration: 2,
            ease: "power1.inOut",
          },
          "<"
        )
        .to(
          ".overlay",
          {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            duration: 2,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.to(".overlay", {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                duration: 1,
                ease: "power1.out",
              });
            },
          },
          "<"
        );
    });
  };

  // Animation for dot pulse
  const animateDotPulse = dotElement => {
    // Create a timeline for the pulse animation
    const tl = gsap.timeline();

    // Pulse animation
    tl.to(dotElement, {
      boxShadow: "0 0 0 8px rgba(223, 0, 0, 0.2)",
      scale: 1.3,
      duration: 0.35,
      ease: "power2.out",
    }).to(dotElement, {
      boxShadow: "0 0 0 0px rgba(223, 0, 0, 0)",
      scale: 1,
      duration: 0.35,
      ease: "power2.in",
    });

    return tl;
  };

  const handleVideoChange = (newIndex, isProgressDot = false) => {
    if (isAnimating || newIndex === displayedVideoIndex) return;

    console.log(`Changing video to index ${newIndex}`);
    setIsAnimating(true);

    // Set transition triggered flag to prevent multiple transitions
    transitionTriggeredRef.current = true;

    // Then start video transition
    const currentVideo = videoRefs.current[activeVideoElement];
    const inactiveVideoElement = activeVideoElement === 0 ? 1 : 0;
    const nextVideo = videoRefs.current[inactiveVideoElement];

    // Set the source of the next video
    nextVideo.src = featuredWorks[newIndex].videoUrl;
    nextVideo.load();

    // Preload the next video in the sequence for seamless transitions
    const nextNextIndex = (newIndex + 1) % featuredWorks.length;
    const preloadNextVideo = new Image();
    preloadNextVideo.src = featuredWorks[nextNextIndex].videoUrl;

    // Create a timeline for the entire transition
    const transitionTl = gsap.timeline();

    // Add text out animation at the start
    transitionTl.add(animateTextOut());

    // When the next video is ready, animate the transition
    nextVideo.onloadeddata = () => {
      // Start video transition
      animateVideoTransition(currentVideo, nextVideo, nextNextIndex).then(
        () => {
          // Update state after transition completes
          setActiveVideoElement(inactiveVideoElement);
          setDisplayedVideoIndex(newIndex);
          setCurrentVideoIndex(newIndex);

          // Reset the current time of the now inactive video
          currentVideo.currentTime = 0;
          currentVideo.pause();

          // Add text in animation
          animateTextIn();

          // Update animation state
          setIsAnimating(false);
          transitionTriggeredRef.current = false;
        }
      );
    };

    // Handle errors loading the next video
    nextVideo.onerror = () => {
      console.error("Error loading video:", featuredWorks[newIndex].videoUrl);
      setIsAnimating(false);
      transitionTriggeredRef.current = false;
    };
  };

  // Handle progress dot click
  const handleProgressDotClick = index => {
    handleVideoChange(index, true);
  };

  // Handle video time updates and progress
  useEffect(() => {
    if (!videosLoaded) return;

    const activeVideo = videoRefs.current[activeVideoElement];
    const inactiveVideo = videoRefs.current[activeVideoElement === 0 ? 1 : 0];
    const VIDEO_DURATION = 10; // Base duration before fade starts

    const handleTimeUpdate = () => {
      if (!activeVideo) return;

      const currentTime = activeVideo.currentTime;
      const progress = (currentTime / VIDEO_DURATION) * 100;
      setVideoProgress(Math.min(progress, 100));

      // Start transition at 10 seconds (fade will take 2 seconds)
      if (currentTime >= VIDEO_DURATION && !transitionTriggeredRef.current) {
        console.log("Starting transition");
        transitionTriggeredRef.current = true;

        // Calculate next video index
        const nextIndex = (currentVideoIndex + 1) % featuredWorks.length;

        // Prepare next video
        if (inactiveVideo.src !== featuredWorks[nextIndex].videoUrl) {
          inactiveVideo.src = featuredWorks[nextIndex].videoUrl;
          inactiveVideo.load();
        }

        // Start playing next video and begin transition
        const startTransition = () => {
          inactiveVideo
            .play()
            .then(() => {
              animateVideoTransition(activeVideo, inactiveVideo, nextIndex);
            })
            .catch(err => {
              console.error("Error playing next video:", err);
              transitionTriggeredRef.current = false;
            });
        };

        // If video is loaded, start transition, otherwise wait for it
        if (inactiveVideo.readyState >= 3) {
          startTransition();
        } else {
          inactiveVideo.addEventListener(
            "canplay",
            () => {
              startTransition();
            },
            { once: true }
          );
        }
      }
    };

    const handleVideoEnd = () => {
      if (transitionTriggeredRef.current) return; // Prevent duplicate transitions

      console.log("Video ended, moving to next");
      const nextIndex = (currentVideoIndex + 1) % featuredWorks.length;
      handleVideoChange(nextIndex);
    };

    const handleLoadedMetadata = () => {
      if (activeVideo) {
        // Get actual video duration
        if (activeVideo.duration && !isNaN(activeVideo.duration)) {
          console.log(`Video duration: ${activeVideo.duration}s`);
        }

        // Ensure video plays
        activeVideo
          .play()
          .catch(err => console.error("Error playing video:", err));
      }
    };

    // Handle stalled or waiting events
    const handleStalled = () => {
      console.log("Video stalled, attempting to resume");
      if (activeVideo && !transitionTriggeredRef.current) {
        activeVideo
          .play()
          .catch(err => console.error("Error resuming stalled video:", err));
      }
    };

    // Handle video errors
    const handleVideoError = () => {
      console.error("Video error occurred");
      if (!transitionTriggeredRef.current) {
        const nextIndex = (currentVideoIndex + 1) % featuredWorks.length;
        handleVideoChange(nextIndex);
      }
    };

    if (activeVideo) {
      activeVideo.addEventListener("timeupdate", handleTimeUpdate);
      activeVideo.addEventListener("ended", handleVideoEnd);
      activeVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
      activeVideo.addEventListener("stalled", handleStalled);
      activeVideo.addEventListener("waiting", handleStalled);
      activeVideo.addEventListener("error", handleVideoError);

      // If metadata is already loaded, initialize duration
      if (activeVideo.readyState >= 1) {
        handleLoadedMetadata();
      }

      // Ensure video is playing
      if (activeVideo.paused) {
        activeVideo
          .play()
          .catch(err => console.error("Error playing video in effect:", err));
      }
    }

    return () => {
      if (activeVideo) {
        activeVideo.removeEventListener("timeupdate", handleTimeUpdate);
        activeVideo.removeEventListener("ended", handleVideoEnd);
        activeVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
        activeVideo.removeEventListener("stalled", handleStalled);
        activeVideo.removeEventListener("waiting", handleStalled);
        activeVideo.removeEventListener("error", handleVideoError);
      }
    };
  }, [
    currentVideoIndex,
    featuredWorks.length,
    isAnimating,
    activeVideoElement,
    videosLoaded,
  ]);

  // Initial setup on component mount
  useEffect(() => {
    // Initialize the first video
    const firstVideo = videoRefs.current[0];
    const secondVideo = videoRefs.current[1];

    if (firstVideo) {
      firstVideo.src = featuredWorks[0].videoUrl;
      firstVideo.load();

      // Preload the second video for seamless first transition
      if (secondVideo && featuredWorks.length > 1) {
        secondVideo.src = featuredWorks[1].videoUrl;
        secondVideo.load();
      }

      // When the first video is ready to play
      const handleFirstVideoReady = () => {
        console.log("First video ready to play");
        firstVideo
          .play()
          .then(() => {
            console.log("First video playing");
            setVideosLoaded(true);

            // Small delay to ensure DOM is ready for text animation
            setTimeout(() => {
              console.log("Initial text animation");
              animateTextIn();
            }, 100);
          })
          .catch(err => console.error("Error playing initial video:", err));

        firstVideo.removeEventListener("canplay", handleFirstVideoReady);
      };

      firstVideo.addEventListener("canplay", handleFirstVideoReady);
    }

    // Set initial transition time
    setLastTransitionTime(Date.now());

    // Reset transition flag
    transitionTriggeredRef.current = false;

    return () => {
      const firstVideo = videoRefs.current[0];
      if (firstVideo) {
        firstVideo.removeEventListener("canplay", () => {});
      }

      // Clean up any running animations
      if (textTimelineRef.current) {
        textTimelineRef.current.kill();
      }
    };
  }, []);

  // Initialize text and video on component mount
  useEffect(() => {
    if (videosLoaded) {
      // Set initial opacity for text elements to ensure they're hidden initially
      gsap.set(".word", { opacity: 0, x: 150, y: 0 }); // Use x instead of y

      // Animate text in after a short delay
      setTimeout(() => {
        animateTextIn();
      }, 500);
    }
  }, [videosLoaded]);

  // Trigger text animations when displayedVideoIndex changes
  useEffect(() => {
    if (videosLoaded && !isAnimating) {
      animateTextIn();
    }
  }, [displayedVideoIndex, videosLoaded]);

  return (
    <div className="home">
      <div className="video-background" ref={videoBackgroundRef}>
        {/* First video element */}
        <video
          muted
          playsInline
          loop={false}
          preload="auto"
          className={`background-video ${
            activeVideoElement === 0 ? "active" : "inactive"
          }`}
          ref={el => (videoRefs.current[0] = el)}
        />

        {/* Second video element */}
        <video
          muted
          playsInline
          loop={false}
          preload="auto"
          className={`background-video ${
            activeVideoElement === 1 ? "active" : "inactive"
          }`}
          ref={el => (videoRefs.current[1] = el)}
          style={{ opacity: 0 }} // Initially hidden
        />

        <div className="overlay" ref={overlayRef} />
        <div className="content">
          <div className="content-container">
            <div className="title-section">
              <h1>
                {featuredWorks[displayedVideoIndex].title
                  .split(" ")
                  .map((word, index) => (
                    <span key={index} className="word" ref={addToTitleRefs}>
                      {word}{" "}
                    </span>
                  ))}
              </h1>
            </div>

            <div className="bottom-section">
              <div className="category">
                {featuredWorks[displayedVideoIndex].category
                  .split(" ")
                  .map((word, index) => (
                    <span key={index} className="word" ref={addToCategoryRefs}>
                      {word}{" "}
                    </span>
                  ))}
              </div>
              <MagneticButton scale={0.7}>
                <Link href="/works" className="see-more">
                  See More
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      <div className="counter">{`0${currentVideoIndex + 1}`}</div>

      <div className="progress-indicators" ref={progressIndicatorsRef}>
        {featuredWorks.map((work, index) => (
          <div
            key={index}
            className={`progress-dot ${
              index === currentVideoIndex ? "active" : ""
            }`}
            onClick={() => handleProgressDotClick(index)}
          >
            {index === currentVideoIndex && (
              <div
                className="progress-bar"
                style={{ width: `${videoProgress}%` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
