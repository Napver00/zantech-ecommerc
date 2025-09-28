import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  'https://placehold.co/1200x400/3498db/ffffff?text=Robotics+Kits',
  'https://placehold.co/1200x400/e74c3c/ffffff?text=DIY+Projects',
  'https://placehold.co/1200x400/2ecc71/ffffff?text=Electronic+Components',
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden group">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Hero image ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
       <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">Customize According to Your Project</h1>
        <p className="text-lg md:text-2xl mb-4 drop-shadow-lg font-semibold text-yellow-300">Awaken your hidden Talent</p>
        <Button size="lg" className="bg-red-600 hover:bg-red-700">
          Contact on: +8801627199815
        </Button>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white/75"
        onClick={goToPrevious}
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white/75"
        onClick={goToNext}
      >
        <ChevronRight />
      </Button>
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${index === currentIndex ? 'bg-white' : 'bg-gray-400 hover:bg-gray-200'}`}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;

