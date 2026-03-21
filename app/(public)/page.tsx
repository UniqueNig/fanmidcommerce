import Footer from "@/src/components/layout/Footer";
import Navbar from "@/src/components/layout/Navbar";
import React from "react";
import HeroSection from "./home/HereSection";
import FeaturedProducts from "./home/FeaturedProducts";
import CategoryPreview from "./home/CategoryPreview";

const Home = () => {
  return (
    <>
      <main className="bg-[#0a0a0a] min-h-screen">
        <Navbar />
        <HeroSection />
        <FeaturedProducts />
        <CategoryPreview />
        <Footer />
      </main>
    </>
  );
};

export default Home;
