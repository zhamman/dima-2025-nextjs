import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import useLocomotiveScroll from "../../hooks/useLocomotiveScroll";
import MagneticButton from "../MagneticButton";
import ContactSection from "../ContactSection";

// Animation variants for text reveal
const slideUp = {
  initial: {
    y: "100%",
  },
  open: i => ({
    y: "0%",
    transition: { duration: 0.5, delay: 0.01 * i },
  }),
  closed: {
    y: "100%",
    transition: { duration: 0.5 },
  },
};

const opacity = {
  initial: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.3 },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

const About = () => {
  const router = useRouter();
  // Refs
  const missionSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const videoContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const circleContainerRef = useRef(null);
  const bioSectionRef = useRef(null);
  const bioTextRef = useRef(null);
  const videoRef = useRef(null);
  const previewRef = useRef(null);
  const bioImageRef = useRef(null);

  // State
  const [isBrowser, setIsBrowser] = useState(false);
  const [showFullVideo, setShowFullVideo] = useState(false);
  const [showreelPlaying, setShowreelPlaying] = useState(false);

  // Hooks
  const { scrollYProgress } = useScroll({
    target: circleContainerRef,
    offset: ["start end", "start start"],
  });
  console.log(scrollYProgress);

  const height = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const locomotiveScrollInstance = useLocomotiveScroll(scrollContainerRef);
  const isMissionInView = useInView(missionSectionRef, {
    once: false,
    amount: 0.3,
  });
  const isContactInView = useInView(contactSectionRef, {
    once: false,
    amount: 0.3,
  });
  const isBioInView = useInView(bioTextRef, {
    once: false,
    amount: 0.2,
  });

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Load full video when preview is clicked
  useEffect(() => {
    if (showFullVideo && videoRef.current) {
      videoRef.current.load();
      if (showreelPlaying) {
        videoRef.current.play().catch(err => {
          console.error("Error playing full video:", err);
        });
      }
    }
  }, [showFullVideo, showreelPlaying]);

  // Handlers
  const handleShowreelPlay = () => {
    // Navigate to the video player with the showreel video ID
    router.push("/video/1");
  };

  const scrollToMission = () => {
    missionSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const slideInRightVariants = {
    hidden: {
      x: 100,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.8,
      },
    },
  };

  const maskAnimation = {
    initial: { y: "100%" },
    animate: {
      y: "0%",
      transition: {
        duration: 1,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  return (
    <div className="about" ref={circleContainerRef}>
      <div
        ref={scrollContainerRef}
        className="scroll-container"
        data-scroll-container
      >
        <section className="showreel-section">
          <div
            className="video-container"
            ref={videoContainerRef}
            data-speed="-0.1"
          >
            <video
              ref={previewRef}
              className={`showreel-video preview ${
                showFullVideo ? "hidden" : ""
              }`}
              loop
              muted
              autoPlay
              playsInline
              preload="auto"
              poster="/images/showreel-poster.jpg"
            >
              <source
                src="/videos/previews/reel/showreel-preview.mp4"
                type="video/mp4"
              />
            </video>

            <video
              ref={videoRef}
              className={`showreel-video full ${showFullVideo ? "" : "hidden"}`}
              loop
              muted
              playsInline
              preload="none"
              poster="/images/showreel-poster.jpg"
            >
              <source src="/videos/reel/showreel.mp4" type="video/mp4" />
            </video>

            <div className="video-overlay"></div>
          </div>

          <div className="showreel-content" data-speed="0.1">
            <div className="content-header">
              <h1 className="about-title" data-speed="0.05">
                ABOUT
              </h1>
              <MagneticButton scale={0.7}>
                <button
                  className={`play-showreel ${
                    showreelPlaying ? "playing" : ""
                  }`}
                  onClick={handleShowreelPlay}
                  data-speed="0.15"
                >
                  <span>
                    {showreelPlaying ? "PAUSE SHOWREEL" : "PLAY SHOWREEL"}
                  </span>
                  <div className="play-icon">
                    {showreelPlaying ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="6"
                          y="4"
                          width="4"
                          height="16"
                          fill="currentColor"
                        />
                        <rect
                          x="14"
                          y="4"
                          width="4"
                          height="16"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 5.14v13.72c0 .23.26.37.44.24l11.12-6.86c.18-.11.18-.37 0-.48L8.44 4.9c-.18-.13-.44.01-.44.24z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              </MagneticButton>
            </div>

            <div
              className="scroll-indicator"
              onClick={scrollToMission}
              data-speed="0.2"
            >
              <div className="scroll-text">SCROLL</div>
              <div className="scroll-arrow">
                <div className="down-arrow">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4v16m0 0l-6-6m6 6l6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mission-section" ref={missionSectionRef}>
          <div className="background-image" data-speed="-0.2">
            <img src="/images/bg/scratch-3.png" alt="" />
          </div>
          <motion.div
            className="mission-content"
            data-speed="0.1"
            initial="hidden"
            animate={isMissionInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div
              className="mission-header"
              data-speed="0.05"
              variants={slideInRightVariants}
            >
              <span className="number">01.</span>
              <span className="label">MISSION</span>
            </motion.div>
            <div className="mission-statement">
              {[
                "NOTHING COMPARES",
                "TO THE MAGIC",
                "OF CRAFTING",
                "UNFORGETTABLE",
                "STORIES",
              ].map((line, lineIndex) => (
                <div key={lineIndex} className="mission-line-wrapper">
                  {line.split(" ").map((word, wordIndex) => (
                    <span
                      key={`${lineIndex}-${wordIndex}`}
                      style={{
                        display: "inline-block",
                        overflow: "hidden",
                        marginRight: "0.25em",
                      }}
                    >
                      <motion.span
                        style={{ display: "inline-block" }}
                        variants={slideUp}
                        custom={lineIndex * 5 + wordIndex}
                        initial="initial"
                        animate={isMissionInView ? "open" : "closed"}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="bio-section" ref={bioSectionRef}>
          <div className="bio-header" data-speed="0.05">
            <span className="number">02.</span>
            <span className="label">BIOGRAPHY</span>
          </div>
          <div className="bio-content">
            <div className="bio-text" ref={bioTextRef} data-speed="0.1">
              <p className="paragraph">
                {"Dmitriy Usov is an award-winning Russian-Cypriot director, writer, and editor based in Los Angeles. Dmitriy's portfolio encompasses a wide spectrum of projects, from captivating commercials and visually stunning music videos to thought-provoking short films. His versatility is a testament to his dedication to the craft of storytelling in various forms."
                  .split(" ")
                  .map((word, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        overflow: "hidden",
                        marginRight: "0.25em",
                      }}
                    >
                      <motion.span
                        style={{ display: "inline-block" }}
                        variants={slideUp}
                        custom={index}
                        initial="initial"
                        animate={isBioInView ? "open" : "closed"}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
              </p>

              <p className="paragraph">
                {"A master of storytelling, Dmitriy possesses the remarkable ability to weave together diverse cultures, overcome geographical distances, and traverse through time in his cinematic narratives."
                  .split(" ")
                  .map((word, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        overflow: "hidden",
                        marginRight: "0.25em",
                      }}
                    >
                      <motion.span
                        style={{ display: "inline-block" }}
                        variants={slideUp}
                        custom={index + 30} // Offset to create a staggered effect after first paragraph
                        initial="initial"
                        animate={isBioInView ? "open" : "closed"}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
              </p>

              <p className="paragraph">
                {"Dmitriy Usov is renowned for his mastery of magical realism and historical storytelling. His work transports audiences to worlds where the extraordinary and the historical converge, creating a visual and emotional tapestry that captivates viewers. His films serve as bridges, connecting people from various backgrounds and locations, making him the ideal choice for music labels, artists, and agencies seeking narratives that transcend boundaries."
                  .split(" ")
                  .map((word, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        overflow: "hidden",
                        marginRight: "0.25em",
                      }}
                    >
                      <motion.span
                        style={{ display: "inline-block" }}
                        variants={slideUp}
                        custom={index + 60} // Offset to create a staggered effect after second paragraph
                        initial="initial"
                        animate={isBioInView ? "open" : "closed"}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
              </p>
            </div>

            <div
              className="bio-image"
              ref={bioImageRef}
              data-scroll
              data-scroll-speed="-0.8"
            >
              <div className="image-circle">
                <Image
                  src="/images/dima.jpg"
                  alt="Dmitriy Usov"
                  width={500}
                  height={300}
                  priority
                />
              </div>
              <motion.div
                className="image-caption"
                variants={opacity}
                initial="initial"
                animate={isBioInView ? "open" : "closed"}
              >
                FILM & COMMERCIAL DIRECTOR. PRODUCER. EDITOR.
              </motion.div>
            </div>
          </div>
        </section>
        <motion.div style={{ height }} className="circle-container">
          <div className="circle"></div>
        </motion.div>

        <div ref={contactSectionRef}>
          <ContactSection isContactInView={isContactInView} />
        </div>
      </div>
    </div>
  );
};

export default About;
