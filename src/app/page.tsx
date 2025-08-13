import HeroSection from "./components/pages/HeroSection";
import Script from "next/script";
import Image from "next/image";

export const metadata = {
  title: "Your Website Title",
  description:
    "List, manage, and promote your Hotel, BnB, or Property online with our fully-featured platform.",
  openGraph: {
    type: "website",
    url: "https://next-hotel-delta.vercel.app/",
    title: "Dancah Technology – Smart Property Solutions",
    description:
      "List, manage, and promote your Hotel, BnB, or Property online with our fully-featured platform.",
    images: [
      {
        url: "https://next-hotel-delta.vercel.app/og-banner.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    url: "https://next-hotel-delta.vercel.app/",
    title: "Dancah Technology – Smart Property Solutions",
    description:
      "List, manage, and promote your Hotel, BnB, or Property online with our fully-featured platform.",
    images: [
      "https://next-hotel-delta.vercel.app/og-banner.png",
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
        t=b.createElement(e);t.async=!0;t.src=v;
        s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}
        (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1715922365667083');
        fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <Image
          height={1}
          width={1}
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1715922365667083&ev=PageView&noscript=1"
          alt=""
          unoptimized
        />
      </noscript>
    </>
  );
}
