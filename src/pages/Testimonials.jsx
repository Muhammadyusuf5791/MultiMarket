import React, { useState } from "react";
import Data from '../assets/Data'

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const testimonials = Data[0].testimonials

  return (
    <section className="py-16 bg-gray-50 pt-[20px]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Mijozlar <span className="text-blue-600">sharhlari</span>
        </h2>

        <div className="relative">
          <div className="bg-white rounded-2xl shadow-md p-8 transition-all duration-500">
            <p className="text-lg italic text-gray-700 mb-4">
              “{testimonials[current].text}”
            </p>
            <span className="block text-sm font-semibold text-gray-500">
              {testimonials[current].author}
            </span>
          </div>

          {/* Navigatsiya tugmalari */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-white shadow rounded-full hover:bg-gray-100"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-white shadow rounded-full hover:bg-gray-100"
          >
            ▶
          </button>
        </div>

        {/* Slayder indikatorlari */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, idx) => (
            <span
              key={idx}
              className={`h-3 w-3 rounded-full ${
                idx === current ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Testimonials);
