import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import MagneticButton from "../MagneticButton";

const Contact = () => {
  const marqueeText = "CONTACT ME / LET'S CONNECT + ";
  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="marquee">
          <div className="marquee-content">
            {[...Array(10)].map((_, index) => (
              <h1 key={index}>{marqueeText}</h1>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {[...Array(10)].map((_, index) => (
              <h1 key={`clone-${index}`}>{marqueeText}</h1>
            ))}
          </div>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-intro">
          <h2>
            Direct with passion.
            <br />
            Create without limits.
            <br />
            Let’s tell unforgettable stories.
          </h2>
        </div>

        <div className="contact-footer">
          <div className="social-section">
            <h3>SOCIALS</h3>
            <div className="social-links">
              <MagneticButton>
                <Link href="https://www.youtube.com/@dimauzz" target="_blank">
                  YOUTUBE
                </Link>
              </MagneticButton>
              <span className="separator">—</span>
              <MagneticButton>
                <Link href="https://vimeo.com/user115237183" target="_blank">
                  VIMEO
                </Link>
              </MagneticButton>
              <span className="separator">—</span>
              <MagneticButton>
                <Link
                  href="https://www.linkedin.com/in/dmitriyusv/"
                  target="_blank"
                >
                  LINKEDIN
                </Link>
              </MagneticButton>
              <span className="separator">—</span>
              <MagneticButton>
                <Link href="https://www.instagram.com/dimauz" target="_blank">
                  INSTAGRAM
                </Link>
              </MagneticButton>
            </div>
          </div>

          <div className="contact-info">
            <div className="info-block">
              <h3>GET IN TOUCH</h3>
              <MagneticButton>
                <a href="mailto:dmitriyusv@gmail.com">DMITRIYUSV@GMAIL.COM</a>
              </MagneticButton>
            </div>

            <div className="info-block">
              <h3>LOCATION</h3>
              <p>LOS ANGELES - CALIFORNIA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
