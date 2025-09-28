import React, { useState, useEffect } from 'react';
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

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="w-full h-80 md:h-96 lg:h-[28rem] rounded-2xl" />
        <div className="mt-10 px-6 md:px-12 lg:px-24">
          <Skeleton className="h-16 w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="relative w-full h-80 md:h-96 lg:h-[28rem] rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <p className="text-gray-600">Failed to load images. Please try again later.</p>
        </div>
        <div className="mt-10 px-6 md:px-12 lg:px-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Awaken your hidden <span className="text-slate-500">Talent</span>
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative w-full h-80 md:h-96 lg:h-[28rem] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg">
        {/* Image area: centered and contained */}
        <div className="w-full max-w-4xl flex items-center justify-center px-8">
          {images.map((image, index) => (
            <img
              key={image.id}
              src={image.path}
              alt={`Hero image ${index + 1}`}
              className={`w-full max-w-3xl h-56 md:h-72 lg:h-96 object-contain transition-all duration-700 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0 absolute'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={goToPrevious}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
            </button>
            
            <button
              aria-label="Next image"
              onClick={goToNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-110'
                    : 'bg-white/70 hover:bg-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Large heading below the hero */}
      <div className="mt-12 px-6 md:px-12 lg:px-24">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">
          Awaken your hidden{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Talent
          </span>
        </h2>
      </div>
    </div>
  );
};

export default HeroSection;