import Head from "next/head";
import HeroSection from "./components/pages/HeroSection";

export default function Home() {
  <Head>
    <title>Your Website Title</title>
    <meta name="title" content="Dancah Technology – Smart Property Solutions" />
    <meta
      name="description"
      content="List, manage, and promote your Hotel, BnB, or Property online with our fully-featured platform."
    />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://dancahtechnology.co.ke/" />
    <meta
      property="og:title"
      content="Dancah Technology – Smart Property Solutions"
    />
    <meta
      property="og:description"
      content="List, manage, and promote your Hotel, BnB, or Property online with our fully-featured platform."
    />
    <meta
      property="og:image"
      content="https://dancahtechnology.co.ke/og-banner.png"
    />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://dancahtechnology.co.ke/" />
    <meta
      name="twitter:title"
      content="Dancah Technology – Smart Property Solutions"
    />
    <meta
      name="twitter:description"
      content="List, manage, and promote your Hotel, BnB, or Property online with our fully-featured platform."
    />
    <meta
      name="twitter:image"
      content="https://dancahtechnology.co.ke/og-banner.png"
    />
  </Head>;
  return (
    <>
      <HeroSection />
    </>
  );
}
