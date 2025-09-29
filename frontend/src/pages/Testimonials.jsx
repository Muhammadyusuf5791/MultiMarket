import React, { useState, useEffect } from "react";
import Data from "../assets/Data";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  
  // ✅ Data ni CHAQIRISH kerak - bu funksiya!
  const data = Data();
  const testimonials = data[0]?.testimonials || [];

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
    if (testimonials.length === 0) return; // Agar testimonial bo'lmasa, intervalni ishga tushirma
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Cycle every 5 seconds
    return () => clearInterval(timer);
  }, [testimonials.length]); // testimonials.length ni dependency ga qo'shish

  // Agar testimonial bo'lmasa, komponentni ko'rsatma
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 pt-[20px]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          {t("testimonials.title")}{" "}
          <span className="text-blue-600">{t("testimonials.highlight")}</span>
        </h2>

        <div className="relative">
          <div className="bg-white rounded-2xl shadow-md p-8 transition-all duration-500">
            <p className="text-lg italic text-gray-700 mb-4">
              "{testimonials[current]?.text}"
            </p>
            <span className="block text-sm font-semibold text-gray-500">
              {testimonials[current]?.author}
            </span>
          </div>

          {/* Navigatsiya tugmalari */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-white shadow rounded-full hover:bg-gray-100"
            aria-label={t("testimonials.prev")}
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-white shadow rounded-full hover:bg-gray-100"
            aria-label={t("testimonials.next")}
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
              aria-label={`${t("testimonials.goTo")} ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Testimonials);