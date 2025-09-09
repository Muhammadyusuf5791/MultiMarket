import React from "react";
import Footer from "../components/Footer"
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Sarlavha */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Biz haqimizda
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          MultiMarket — elektr, santexnika va boshqa ko'plab sohalar uchun
          mahsulotlarni bir joyda jamlagan onlayn bozor. Maqsadimiz sizga
          qulay, tezkor va ishonchli xizmat ko'rsatish.
        </p>
      </div>

      {/* Asosiy kontent */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Chap taraf */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Nega bizni tanlashingiz kerak?
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>✅ Elektr va santexnika mahsulotlarining keng tanlovi</li>
            <li>✅ Tezkor yetkazib berish xizmati</li>
            <li>✅ Sifatli va kafolatlangan mahsulotlar</li>
            <li>✅ 24/7 qo'llab-quvvatlash xizmati</li>
          </ul>

          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300">
            <Link to="/contact">Bog'lanish</Link>
          </button>
        </div>

        {/* O‘ng taraf rasm */}
        <div className="flex justify-center">
          <img
            src="https://img.freepik.com/free-vector/business-team-concept-illustration_114360-678.jpg"
            alt="Biz haqimizda"
            className="rounded-2xl shadow-lg w-full md:w-4/5"
          />
        </div>
      </div>
    </section>
    <Footer />
    </div>
  );
};

export default React.memo(About);
