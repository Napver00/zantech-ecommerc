import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CategorySidebar from "@/components/CategorySidebar";
import CompletePackage from "@/components/CompletePackage";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="col-span-1 hidden lg:block">
            <CategorySidebar />
          </aside>
          <div className="col-span-1 lg:col-span-3">
            <HeroSection />
            <CompletePackage />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
