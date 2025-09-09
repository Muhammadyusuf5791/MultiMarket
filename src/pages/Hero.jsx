import React from "react";
import img1 from "../assets/img1.png";

const Hero = () => {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-8">
      {/* Left content */}
      <div className="text-center md:text-left max-w-xl">
        <h3 className="text-2xl md:text-3xl pb-3 text-blue-600 font-mono">
          MultiMarket
        </h3>
        <h1 className="text-3xl md:text-5xl font-bold leading-snug">
          Barcha elektr va santexnika <br className="hidden md:block" /> mahsulotlari — bir joyda!
        </h1>
        <p className="text-lg md:text-2xl pt-5 text-gray-700">
          Oson qidiruv, tezkor yetkazib berish va ishonchli <br className="hidden md:block" /> sotuvchilar bilan.
        </p>
        <button className="bg-blue-500 mt-8 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 ease">
          Ko'proq
        </button>
      </div>

      {/* Right image */}
      <div className="mt-8 md:mt-0 md:ml-6 flex justify-center">
        <img src={img1} alt="rasm" className="w-full max-w-sm md:max-w-lg" />
      </div>
    </section>
  );
};

export default React.memo(Hero);
