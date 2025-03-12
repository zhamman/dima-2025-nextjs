import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const MarqueeText = ({ text, className = "" }) => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      setWidth(textRef.current.offsetWidth);
    }
  }, [text]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ width: "100%" }}
    >
      <motion.div
        ref={textRef}
        className={`flex whitespace-nowrap ${className}`}
        animate={{
          x: [-width, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        <h1>{text}</h1>
        <h1 style={{ marginLeft: "4rem" }}>{text}</h1>
      </motion.div>
    </div>
  );
};

export default MarqueeText;
