"use client";

import { useEffect, useState } from "react";
import PropertyNavbar from "./navbar";
import LandingPage from "./Landingpage";
import AboutPage from "./about";
import { IProperty } from "@/models/property";
import Services from "./Services";
import Comments from "./Comments";
import Footer from "./footer";

export default function HeroSection() {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/admin/property");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const firstProperty = properties[0];

  // ✅ Only render children when firstProperty is ready
  if (loading) return <div>Loading...</div>;
  if (!firstProperty) return <div>No property found.</div>;

  return (
    <>
      <PropertyNavbar property={firstProperty} />
      <LandingPage property={firstProperty} />
      <Services property={firstProperty} />

      <AboutPage property={firstProperty} />
      <Comments />
      <Footer/>
    </>
  );
}
