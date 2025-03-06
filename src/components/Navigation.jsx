import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

const Navigation = () => {
  const logoText = "DMITRIY USOV";

  // Variants for the logo letter animations
  const letterVariants = {
    initial: {
      color: "#df0000", // $accent-color
    },
    hover: {
      color: "#ffffff", // $light-text
      // y: [-2, 0],
      transition: {
        // y: { duration: 0.25, repeat: 1, repeatType: "reverse" },
        color: { duration: 0.5 },
      },
    },
  };

  // Variants for individual letter hover
  const singleLetterVariants = {
    initial: {
      color: "#df0000", // $accent-color
      scale: 1,
    },
    hover: {
      color: "#ffffff", // $light-text
      scale: 1.1,
      transition: {
        duration: 0.25,
        repeat: 2,
        repeatType: "reverse",
      },
    },
  };

  return (
    <nav className="main-nav">
      <div className="nav-content">
        <MagneticButton scale={0.5}>
          <Link href="/" className="logo">
            <motion.span
              className="logo-text"
              whileHover="hover"
              initial="initial"
            >
              {logoText.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  className={`logo-letter ${
                    letter === " " ? "logo-space" : ""
                  }`}
                  variants={letterVariants}
                  custom={index}
                  whileHover={singleLetterVariants.hover}
                  style={{
                    display: "inline-block",
                    position: "relative",
                    color: "#df0000",
                    margin: letter === " " ? "0 0.3rem" : "0",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.span>
          </Link>
        </MagneticButton>

        <div className="nav-links">
          {/* <MagneticButton scale={0.7}>
            <Link href="/">HOME</Link>
          </MagneticButton> */}
          <MagneticButton scale={0.7}>
            <Link href="/works">WORKS</Link>
          </MagneticButton>
          <MagneticButton scale={0.7}>
            <Link href="/about">ABOUT</Link>
          </MagneticButton>
          <MagneticButton scale={0.7}>
            <Link href="/contact">CONTACT</Link>
          </MagneticButton>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
