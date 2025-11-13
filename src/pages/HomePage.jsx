import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CategorySidebar from "@/components/CategorySidebar";
import CompletePackage from "@/components/CompletePackage";
import CompetitionPackage from "@/components/CompetitionPackage";
import BestSelling from "@/components/BestSelling";
import RecentlyAdded from "@/components/RecentlyAdded";
import Seo from "@/components/Seo";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/*  SEO for homepage */}
      <Seo
        title="Zantech Store - Robotics, IoT & Electronics in Bangladesh"
        description="Shop Arduino, ESP32, Raspberry Pi, sensors, robotics kits, competition robot packages, and IoT solutions in Bangladesh. Perfect for students, hobbyists, and professionals."
        url="https://store.zantechbd.com/"
        type="website"
        keywords="Zantech Store, Arduino Bangladesh, ESP32 Bangladesh, robotics store BD, IoT store Bangladesh, electronics components Bangladesh, robotics kits, competition robot kit, STEM education Bangladesh"
      />

      <Header />
      <main className="flex-grow container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="col-span-1 hidden lg:block">
            <CategorySidebar />
          </aside>
          <div className="col-span-1 lg:col-span-3">
            <HeroSection />
            <CompletePackage />
            <CompetitionPackage />
            <BestSelling />
            <RecentlyAdded />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
