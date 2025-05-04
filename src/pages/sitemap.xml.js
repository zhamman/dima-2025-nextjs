import { NextResponse } from "next/server";
import generateSitemap from "../utils/sitemap";

export async function getServerSideProps({ res }) {
  const sitemap = generateSitemap();

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

// This is needed to prevent Next.js from trying to render this page
export default function Sitemap() {
  return null;
}
