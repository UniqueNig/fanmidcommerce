import Footer from "@/src/components/layout/Footer";
import Navbar from "@/src/components/layout/Navbar";
import React from "react";
import HeroSection from "./home/HereSection";
import FeaturedProducts from "./home/FeaturedProducts";
import CategoryPreview from "./home/CategoryPreview";
import ValueProps from "./home/ValueProps";
import Testimonials from "./home/Testimonials";
import Newsletter from "./home/Newsletter";

// Re-fetch homepage data (categories) at most once a minute so newly added
// categories show up without a redeploy.
export const revalidate = 60;

const Home = () => {
  return (
    <>
      <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <HeroSection />
        <ValueProps />
        <FeaturedProducts />
        <CategoryPreview />
        <Testimonials />
        <Newsletter />
        <Footer />
      </main>
    </>
  );
};

export default Home;
