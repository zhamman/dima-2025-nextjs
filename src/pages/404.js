import React from "react";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/" className="back-home">
        Go back home
      </Link>
      <style jsx>{`
        .not-found-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          padding: 0 20px;
        }
        h1 {
          margin-bottom: 20px;
        }
        .back-home {
          margin-top: 30px;
          padding: 10px 20px;
          background: #000;
          color: #fff;
          text-decoration: none;
          border-radius: 4px;
          transition: opacity 0.2s ease;
        }
        .back-home:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
