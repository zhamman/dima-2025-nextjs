export const generateThumbnail = async videoUrl => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = videoUrl;
    video.currentTime = 20; // Seek to 20 seconds

    video.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth * 0.5; // Half the original width
      canvas.height = video.videoHeight * 0.5; // Half the original height

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to low-quality JPEG
      const thumbnail = canvas.toDataURL("image/jpeg", 0.5);
      resolve(thumbnail);
    });

    video.addEventListener("error", e => reject(e));
  });
};

export const createLowQualityPreview = async videoUrl => {
  try {
    const thumbnail = await generateThumbnail(videoUrl);
    return {
      thumbnail,
      isLoading: false,
      error: null,
    };
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return {
      thumbnail: null,
      isLoading: false,
      error: "Failed to generate thumbnail",
    };
  }
};
