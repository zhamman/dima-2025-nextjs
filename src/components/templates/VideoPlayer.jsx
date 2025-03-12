import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { works } from "../../data/videos";
import { motion } from "framer-motion";

const VideoPlayer = ({ id }) => {
  const router = useRouter();
  const videoId = id || router.query.id;
  const [currentVideo, setCurrentVideo] = useState(null);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [showBackButton, setShowBackButton] = useState(true);
  const videoWrapperRef = useRef(null);

  // Keep refs for the video elements
  const videoRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const vimeoPlayerRef = useRef(null);

  // Add hide-grain class to body when component mounts
  useEffect(() => {
    // Add class to hide grain
    document.body.classList.add("hide-grain");

    // Remove class when component unmounts
    return () => {
      document.body.classList.remove("hide-grain");
    };
  }, []);

  // Find the current video and set up suggested videos
  useEffect(() => {
    // Only proceed if videoId is defined and router is ready
    if (videoId && works && router.isReady) {
      // Convert videoId to number if it's a string
      const numericVideoId =
        typeof videoId === "string" ? parseInt(videoId, 10) : videoId;

      const foundVideo = works.find(video => video.id === numericVideoId);

      if (foundVideo) {
        setCurrentVideo(foundVideo);

        // Shuffle the works array for suggested videos
        const otherVideos = works.filter(video => video.id !== numericVideoId);
        const shuffled = [...otherVideos].sort(() => 0.5 - Math.random());

        // Take first 3 videos after shuffling
        setSuggestedVideos(shuffled.slice(0, 3));
      } else if (router.isReady) {
        // Only redirect if router is ready and video truly not found
        router.replace("/works");
      }
    }
  }, [videoId, router, router.isReady]);

  // Scroll to video info section
  const scrollToInfo = () => {
    const videoInfo = document.querySelector(".video-info");
    if (videoInfo) {
      videoInfo.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Navigate back to works page
  const handleBackClick = () => {
    router.push("/works");
  };

  // Helper function to render all available credits
  const renderCredits = () => {
    // Define which properties should be treated as credits
    // and their display labels
    const creditFields = {
      director: "DIRECTOR",
      cinematography: "CINEMATOGRAPHY",
      editor: "EDITOR",
      producer: "PRODUCER",
      videographer: "VIDEOGRAPHER",
      year: "YEAR",
      client: "CLIENT",
      music: "MUSIC",
      colorist: "COLORIST",
      soundDesign: "SOUND DESIGN",
      productionCompany: "PRODUCTION COMPANY",
      agency: "AGENCY",
      // Add any other potential credit fields here
    };

    return Object.entries(creditFields).map(([field, label]) => {
      // Only render if the field exists in the video object
      if (currentVideo[field]) {
        return (
          <div className="credit-item" key={field}>
            <span className="label">{label}</span>
            <span className="value">{currentVideo[field]}</span>
          </div>
        );
      }
      return null;
    });
  };

  // Render the appropriate video embed based on video type
  const renderVideoEmbed = () => {
    if (!currentVideo) return null;

    if (currentVideo.videoType === "youtube") {
      return (
        <div className="embed-container youtube-container">
          <iframe
            ref={youtubePlayerRef}
            src={`https://www.youtube.com/embed/${currentVideo.videoId}?enablejsapi=1&autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&color=red&iv_load_policy=3&fs=1&disablekb=0&playsinline=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={currentVideo.title}
          ></iframe>
        </div>
      );
    } else if (currentVideo.videoType === "vimeo") {
      return (
        <div className="embed-container vimeo-container">
          <iframe
            ref={vimeoPlayerRef}
            src={`https://player.vimeo.com/video/${currentVideo.videoId}?autoplay=1&loop=0&title=0&byline=0&portrait=0&color=df0000&controls=1&sidedock=0&badge=0&autopause=0&dnt=1&quality=1080p&transparent=0`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={currentVideo.title}
          ></iframe>
        </div>
      );
    } else {
      // Default to HTML5 video with native controls
      return (
        <video
          ref={videoRef}
          src={currentVideo.videoUrl}
          controls
          autoPlay
          playsInline
          controlsList="nodownload"
          className="video-element"
        />
      );
    }
  };

  if (!currentVideo) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="video-player-page">
      <div className="video-player-container">
        <div className="video-wrapper" ref={videoWrapperRef}>
          {renderVideoEmbed()}

          <button
            className={`back-button visible`}
            onClick={handleBackClick}
            aria-label="Back to works"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back</span>
          </button>

          <div className="scroll-indicator" onClick={scrollToInfo}>
            <span>MORE INFO</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5v14M5 12l7 7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="video-info">
          <h2 className="video-title">{currentVideo.title}</h2>
          <div className="video-credits">
            <div className="credit-group">{renderCredits()}</div>
          </div>
        </div>

        <div className="suggested-videos">
          <h3>MORE VIDEOS</h3>
          <div className="suggested-grid">
            {suggestedVideos.map(video => (
              <Link
                href={`/video/${video.id}`}
                key={video.id}
                className="suggested-video"
              >
                <div className="thumbnail-container">
                  <img src={video.thumbnail} alt="" />
                </div>
                <div className="suggested-info">
                  <span className="number">{video.number}</span>
                  <span className="title">{video.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
