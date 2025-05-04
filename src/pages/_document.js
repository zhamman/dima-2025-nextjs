import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Step into the visionary world of Dmitriy Usov - an acclaimed Film & Commercial Director who transforms stories into spellbinding visual experiences. From mesmerizing music videos to soul-stirring short films, his work masterfully blends artistic innovation with emotional depth. Discover a portfolio where every frame tells an unforgettable story."
          />
          <meta
            name="keywords"
            content="Dmitriy Usov, film director, commercial director, editor, cinematographer, video production, historical storytelling, portfolio, filmmaker"
          />
          <meta name="author" content="Dmitriy Usov" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="Dmitriy Usov - Film & Commercial Director"
          />
          <meta
            property="og:description"
            content="Award-winning Film & Commercial Director specializing in magical realism and historical storytelling."
          />
          <meta property="og:image" content="/images/dima.jpg" />
          <meta property="og:url" content="https://dimauz.com" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Dmitriy Usov - Film & Commercial Director"
          />
          <meta
            name="twitter:description"
            content="Award-winning Film & Commercial Director specializing in magical realism and historical storytelling."
          />
          <meta name="twitter:image" content="/images/dima.jpg" />

          {/* Favicon
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}

          {/* JSON-LD Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Dmitriy Usov",
                jobTitle: "Film & Commercial Director",
                description:
                  "Award-winning Film & Commercial Director specializing in magical realism and historical storytelling.",
                url: "https://dimauz.com",
                image: "/images/dima.jpg",
                sameAs: [
                  "https://www.instagram.com/dimauz",
                  "https://www.linkedin.com/in/dmitriyusv/",
                  "https://vimeo.com/user115237183",
                ],
                worksFor: {
                  "@type": "Organization",
                  name: "Independent Filmmaker",
                },
              }),
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
