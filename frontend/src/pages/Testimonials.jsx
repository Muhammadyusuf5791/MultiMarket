// Testimonials.js
import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Testimonials = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "testimonials"),
      where("approved", "==", true)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const testimonialsData = [];
      querySnapshot.forEach((doc) => {
        testimonialsData.push({ id: doc.id, ...doc.data() });
      });
      
      const sortedTestimonials = testimonialsData
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        })
        .slice(0, 5);
      
      setTestimonials(sortedTestimonials);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const StarDisplay = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        {/* To'liq yulduzchalar */}
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
        ))}
        
        {/* Yarim yulduzcha */}
        {hasHalfStar && (
          <FaStarHalfAlt className="text-yellow-400 text-sm" />
        )}
        
        {/* Bo'sh yulduzchalar */}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-sm" />
        ))}
        
        <span className="text-sm text-gray-600 ml-2">({rating})</span>
      </div>
    );
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  useEffect(() => {
    if (testimonials.length === 0) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-10"></div>
            <div className="h-32 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
            {t("testimonials.title")}{" "}
            <span className="text-blue-600">{t("testimonials.highlight")}</span>
          </h2>
          <div className="bg-white rounded-2xl shadow-md p-8">
            <p className="text-lg text-gray-600">
              Hozircha sharhlar mavjud emas. Birinchi bo'ling!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          {t("testimonials.title")}{" "}
          <span className="text-blue-600">{t("testimonials.highlight")}</span>
        </h2>

        <div className="relative">
          <div className="bg-white rounded-2xl shadow-md p-8 transition-all duration-500">
            {/* Reyting ko'rsatish */}
            <div className="flex justify-center mb-4">
              <StarDisplay rating={testimonials[current]?.rating || 0} />
            </div>
            
            <p className="text-lg italic text-gray-700 mb-4">
              "{testimonials[current]?.text}"
            </p>
            
            <span className="block text-sm font-semibold text-gray-500">
              {testimonials[current]?.author}
            </span>
            <span className="block text-xs text-gray-400 mt-1">
              {testimonials[current]?.createdAt?.toDate 
                ? testimonials[current].createdAt.toDate().toLocaleDateString('uz-UZ')
                : 'Yaqinda'
              }
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