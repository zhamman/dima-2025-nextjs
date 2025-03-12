"use client";

import React from "react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import styles from "../styles/ContactSection.module.scss";
import Image from "next/image";

const ContactSection = ({ isContactInView }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const slideInRightVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const socialButtonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.backgroundImageContact} data-speed="-0.2">
        <img src="/images/bg/scratch-3.png" alt="" />
      </div>
      <motion.div
        className={styles.contactContent}
        initial="hidden"
        animate={isContactInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className={styles.contactHeader} variants={fadeInVariants}>
          <h2 className={styles.contactHeading}>GET IN TOUCH</h2>
        </motion.div>

        <motion.div
          className={styles.emailContainer}
          variants={slideInRightVariants}
        >
          <MagneticButton scale={0.5}>
            <a href="mailto:dimauzfilm@gmail.com" className={styles.emailLink}>
              dimauzfilm@gmail.com
            </a>
          </MagneticButton>
        </motion.div>

        <div className={styles.footerContainer}>
          <motion.div
            className={styles.socialLinks}
            variants={slideInRightVariants}
          >
            <motion.div custom={0} variants={socialButtonVariants}>
              <MagneticButton scale={1.0}>
                <a
                  href="https://www.youtube.com/@dimauzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                >
                  <span>YOUTUBE</span>
                </a>
              </MagneticButton>
            </motion.div>
            <motion.div custom={1} variants={socialButtonVariants}>
              <MagneticButton scale={1.0}>
                <a
                  href="https://www.instagram.com/dimauz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                >
                  <span>INSTAGRAM</span>
                </a>
              </MagneticButton>
            </motion.div>
            <motion.div custom={2} variants={socialButtonVariants}>
              <MagneticButton scale={1.0}>
                <a
                  href="https://vimeo.com/user115237183"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                >
                  <span>VIMEO</span>
                </a>
              </MagneticButton>
            </motion.div>
            <motion.div custom={2} variants={socialButtonVariants}>
              <MagneticButton scale={1.0}>
                <a
                  href="https://www.linkedin.com/in/dmitriyusv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                >
                  <span>LINKEDIN</span>
                </a>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
        <div className={styles.credits}>
          <motion.div className={styles.copyright} variants={fadeInVariants}>
            DMITRIY USOV © 2025
          </motion.div>
          <motion.div className={styles.credit} variants={fadeInVariants}>
            DESIGN & DEV ✦ ZACH HAMMAN
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
