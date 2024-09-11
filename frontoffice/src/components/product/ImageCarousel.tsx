import React, { useState } from 'react';

const images = [
  '/path/to/image1.png',
  '/path/to/image2.png',
  '/path/to/image3.png',
  '/path/to/image4.png',
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <img
          src={images[currentIndex]}
          alt="carousel"
          className="w-full h-auto transition-transform duration-300"
        />
      </div>
      {/* Bouton précédent */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none"
      >
        &#10094;
      </button>
      {/* Bouton suivant */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none"
      >
        &#10095;
      </button>
    </div>
  );
};

export default ImageCarousel;
