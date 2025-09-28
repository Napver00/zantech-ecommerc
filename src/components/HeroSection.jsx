import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { config } from '@/config';

const HeroSection = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${config.baseURL}/hero-images`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setImages(result.data);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (e) {
        console.error("Failed to fetch hero images:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  const goToPrevious = () => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (isLoading) {
    return <Skeleton className="w-full h-64 md:h-80 lg:h-96 rounded-lg" />;
  }

  if (error) {
    return (
      <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden group bg-red-100 flex items-center justify-center">
        <p className="text-red-600">Failed to load images. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative w-full h-80 md:h-96 lg:h-[28rem] flex items-center justify-center overflow-hidden">
        {/* Image area: centered and contained */}
        <div className="w-full max-w-4xl flex items-center justify-center px-8">
          {images.map((image, index) => (
            <img
              key={image.id}
              src={image.path}
              alt={`Hero image ${index + 1}`}
              className={`w-full max-w-3xl h-56 md:h-72 lg:h-96 object-contain transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0 absolute'}`}
            />
          ))}
        </div>

        {/* Left / Right circular arrows - visible */}
        <button
          aria-label="previous"
          onClick={goToPrevious}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md w-10 h-10 rounded-full flex items-center justify-center"
        >
          <ChevronLeft />
        </button>
        <button
          aria-label="next"
          onClick={goToNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md w-10 h-10 rounded-full flex items-center justify-center"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Large heading below the hero, matching screenshot */}
      <div className="mt-10 px-6 md:px-12 lg:px-24">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">Awaken your hidden <span className="text-slate-500">Talent</span></h2>
      </div>
    </div>
  );
};

export default HeroSection;

