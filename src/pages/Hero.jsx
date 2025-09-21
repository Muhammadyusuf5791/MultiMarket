import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import img1 from "../assets/img1.png";

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-12 py-6">
      {/* Left content */}
      <div className="text-center md:text-left max-w-lg md:max-w-xl space-y-4 md:space-y-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-blue-600 font-mono">
          {t("hero.title")}
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-snug">
          {t("hero.subtitle")}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-700">
          {t("hero.description")}
        </p>
        <button
          className="bg-blue-500 mt-6 sm:mt-8 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 ease"
          onClick={() => navigate("/about-multimarket")}
          aria-label={t("hero.buttonAriaLabel")}
        >
          {t("hero.button")}
        </button>
      </div>

      {/* Right image */}
      <div className="mt-6 md:mt-0 md:ml-8 flex justify-center w-full">
        <img
          src={img1}
          alt={t("hero.imageAlt")}
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default React.memo(Hero);