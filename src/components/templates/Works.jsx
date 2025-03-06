import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { categories, works } from "../../data/videos";
import useLocomotiveScroll from "../../hooks/useLocomotiveScroll";
import MagneticButton from "../MagneticButton";

const Works = () => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loadingStates, setLoadingStates] = useState({});
  const [errorStates, setErrorStates] = useState({});
  const [visibleVideos, setVisibleVideos] = useState(new Set());
  const [thumbnailStates, setThumbnailStates] = useState({});
  const videoRefs = useRef({});
  const observerRef = useRef(null);
  const mediaRefs = useRef({});
  const router = useRouter();

  // Locomotive scrolling - only initialize on client side
  const scrollContainerRef = useRef(null);
  const [isBrowser, setIsBrowser] = useState(false);
  // Use the custom hook instead of inline dynamic import
  const locomotiveScrollInstance = useLocomotiveScroll(scrollContainerRef);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Load thumbnails for visible items
  useEffect(() => {
    const worksToLoad =
      selectedCategory === "ALL"
        ? works
        : works.filter(work => work.category === selectedCategory);

    // Set all thumbnails at once
    const newThumbnailStates = {};
    worksToLoad.forEach(work => {
      newThumbnailStates[work.id] = {
        url: work.thumbnail,
        loaded: true,
      };
    });
    setThumbnailStates(newThumbnailStates);
  }, [selectedCategory]);

  // Initialize intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const videoId = entry.target.dataset.videoId;
          if (entry.isIntersecting) {
            setVisibleVideos(prev => new Set([...prev, videoId]));
          }
        });
      },
      { rootMargin: "100px" }
    );

    // Observe all work media elements
    Object.values(mediaRefs.current).forEach(ref => {
      if (ref) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [selectedCategory]); // Re-run when category changes

  // Update observer when media refs change
  useEffect(() => {
    if (observerRef.current) {
      // Disconnect previous observations
      observerRef.current.disconnect();

      // Observe all work media elements
      Object.values(mediaRefs.current).forEach(ref => {
        if (ref) {
          observerRef.current.observe(ref);
        }
      });
    }
  }, [mediaRefs.current, selectedCategory]);

  const handleVideoLoad = id => {
    const video = videoRefs.current[id];
    if (video) {
      video.currentTime = 0;
      video.classList.add("loaded");
    }
    setErrorStates(prev => ({ ...prev, [id]: false }));
    setLoadingStates(prev => ({ ...prev, [id]: false }));
  };

  const handleMouseEnter = id => {
    const video = videoRefs.current[id];
    if (video && !errorStates[id]) {
      // Start loading the video if it hasn't been loaded yet
      if (!visibleVideos.has(id.toString())) {
        setVisibleVideos(prev => new Set([...prev, id.toString()]));
      }

      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        // Set loading state before attempting to play
        setLoadingStates(prev => ({ ...prev, [id]: true }));
        video
          .play()
          .then(() => {
            video.style.opacity = "1";
            // Clear loading state when video starts playing
            setLoadingStates(prev => ({ ...prev, [id]: false }));
            // Fade out the thumbnail
            const thumbnail = document.querySelector(
              `[data-thumbnail-id="${id}"]`
            );
            if (thumbnail) {
              thumbnail.classList.add("fade-out");
            }
          })
          .catch(error => {
            console.log(`Error playing video ${id}:`, error);
            setErrorStates(prev => ({ ...prev, [id]: true }));
            setLoadingStates(prev => ({ ...prev, [id]: false }));
          });
      }, 150);
    }
  };

  const handleMouseLeave = id => {
    const video = videoRefs.current[id];
    if (video && !errorStates[id]) {
      video.pause();
      video.style.opacity = "0";
      // Clear loading state when mouse leaves
      setLoadingStates(prev => ({ ...prev, [id]: false }));
      // Show thumbnail again
      const thumbnail = document.querySelector(`[data-thumbnail-id="${id}"]`);
      if (thumbnail) {
        thumbnail.classList.remove("fade-out");
      }
      setTimeout(() => {
        video.currentTime = 0;
        setTimeout(() => {
          video.style.opacity = "1";
        }, 50);
      }, 150);
    }
  };

  const handleVideoError = id => {
    console.log(`Error loading video ${id}`);
    setLoadingStates(prev => ({ ...prev, [id]: false }));
    setErrorStates(prev => ({ ...prev, [id]: true }));
  };

  const handleVideoClick = video => {
    // Navigate to the video player page
    router.push(`/video/${video.id}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: {
      x: "100%",
    },
    show: {
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      x: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const itemVariants = {
    hidden: {
      x: 0,
    },
    show: {
      x: 0,
      transition: {
        duration: 0.1,
      },
    },
    exit: {
      x: 0,
      transition: {
        duration: 0.1,
      },
    },
  };

  const filteredWorks =
    selectedCategory === "ALL"
      ? works
      : works.filter(work => work.category === selectedCategory);

  return (
    <div className="works">
      <div
        ref={scrollContainerRef}
        className="scroll-container"
        data-scroll-container
      >
        <div className="categories" data-scroll-section>
          {categories.map(category => (
            <MagneticButton key={category} scale={0.2}>
              <button
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            </MagneticButton>
          ))}
        </div>

        <div className="works-grid" data-scroll-section>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selectedCategory}
              className="works-grid-inner"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ position: "relative", width: "100%" }}
            >
              {filteredWorks.map(work => (
                <motion.div
                  key={work.id}
                  className={`work-item ${errorStates[work.id] ? "error" : ""}`}
                  onClick={() => handleVideoClick(work)}
                  data-scroll
                  data-scroll-speed="0.1"
                  variants={itemVariants}
                >
                  <div className="work-header">
                    <span className="number">{work.number}</span>
                    <span className="title">{work.title}</span>
                  </div>
                  <div
                    className="work-content"
                    onMouseEnter={() => handleMouseEnter(work.id)}
                    onMouseLeave={() => handleMouseLeave(work.id)}
                  >
                    <div
                      className="work-media"
                      data-video-id={work.id}
                      ref={el => (mediaRefs.current[work.id] = el)}
                    >
                      <Image
                        src={work.thumbnail}
                        alt=""
                        className="thumbnail"
                        data-thumbnail-id={work.id}
                        width={300}
                        height={200}
                      />
                      {visibleVideos.has(work.id.toString()) && (
                        <>
                          <video
                            ref={el => (videoRefs.current[work.id] = el)}
                            src={work.previewUrl}
                            muted
                            playsInline
                            loop
                            preload="metadata"
                            onLoadedData={() => handleVideoLoad(work.id)}
                            onError={() => handleVideoError(work.id)}
                          />
                          {loadingStates[work.id] && (
                            <div className="loading-overlay">
                              <div className="loading-spinner" />
                            </div>
                          )}
                        </>
                      )}
                      <div className="work-info">
                        <h3>{work.title}</h3>
                        <p>{work.category}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Works;
