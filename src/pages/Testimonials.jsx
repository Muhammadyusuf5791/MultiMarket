import React, { useState, useEffect } from "react";
import Data from '../assets/Data';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const testimonials = Data[0].testimonials;

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  // Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Cycle every 5 seconds

    // Cleanup interval on component unmount or user interaction
    return () => clearInterval(timer);
  }, []); // Empty dependency array to run once on mount

  return (
    <section className="py-16 bg-gray-50 pt-[20px]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Mijozlar <span className="text-blue-600">sharhlari</span>
        </h2>

        <div className="relative">
          <div className="bg-white rounded-2xl shadow-md p-8 transition-all duration-500">
            <p className="text-lg italic text-gray-700 mb-4">
              "{testimonials[current].text}"
            </p>
            <span className="block text-sm font-semibold text-gray-500">
              {testimonials[current].author}
            </span>
          </div>

          {/* Navigatsiya tugmalari */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-white shadow rounded-full hover:bg-gray-100"
            aria-label="Previous testimonial"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-white shadow rounded-full hover:bg-gray-100"
            aria-label="Next testimonial"
          >
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Slayder indikatorlari */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-3 w-3 rounded-full ${
                idx === current ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Testimonials);