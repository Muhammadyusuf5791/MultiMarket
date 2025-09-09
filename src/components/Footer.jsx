import React from "react";
import { Link } from "react-router-dom";
import { FaTelegram, FaInstagram, FaYoutube, FaPhoneAlt } from "react-icons/fa";
import logo4 from "../assets/logo4.png";
import { MdLocationPin, MdOutlineEmail } from "react-icons/md";

const Footer = () => {
  return (
    <section className="bg-white border-t">
      {/* Asosiy qism */}
      <div className="flex flex-col md:flex-row md:justify-between gap-8 w-full p-6 md:p-10">
        {/* Logo va matn */}
        <div className="text-center md:text-left">
          <img src={logo4} alt="logo" className="w-[180px] mx-auto md:mx-0" />
          <p className="mt-3 text-gray-600">
            MultiMarket — sizning ishonchli <br /> hamkoringiz.
          </p>
        </div>

        {/* Tezkor havolalar */}
        <div className="text-center md:text-left">
          <h3 className="pb-3 text-xl font-semibold">Tezkor havolalar</h3>
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="hover:text-blue-600 transition-all duration-300 ease"
            >
              Bosh sahifa
            </Link>
            <Link
              to="/sohalar"
              className="hover:text-blue-600 transition-all duration-300 ease"
            >
              Kategoriyalar
            </Link>
            <Link
              to="/about"
              className="hover:text-blue-600 transition-all duration-300 ease"
            >
              Biz haqimizda
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-600 transition-all duration-300 ease"
            >
              Aloqa
            </Link>
          </div>
        </div>

        {/* Aloqa */}
        <div className="text-center md:text-left">
          <h3 className="pb-3 text-xl font-semibold">Aloqa</h3>
          <div className="flex flex-col gap-3 text-gray-700">
            <p className="flex justify-center md:justify-start items-center gap-2">
              <MdLocationPin className="text-2xl text-blue-600" />
              Namangan, O'zbekiston
            </p>
            <p className="flex justify-center md:justify-start items-center gap-2">
              <FaPhoneAlt className="text-blue-600" />
              +998 (90) 690 64 44
            </p>
            <p className="flex justify-center md:justify-start items-center gap-2">
              <MdOutlineEmail className="text-2xl text-blue-600" />
              multimarket@gmail.com
            </p>
          </div>
        </div>

        {/* Ijtimoiy tarmoqlar */}
        <div className="text-center md:text-left">
          <h3 className="pb-3 text-xl font-semibold">Ijtimoiy tarmoqlar:</h3>
          <div className="flex justify-center md:justify-start gap-5 text-gray-700">
            <FaTelegram className="text-3xl cursor-pointer hover:text-blue-500 transition" />
            <FaInstagram className="text-3xl cursor-pointer hover:text-pink-500 transition" />
            <FaYoutube className="text-3xl cursor-pointer hover:text-red-500 transition" />
          </div>
        </div>
      </div>

      {/* Pastki qism */}
      <div className="flex justify-center p-4 bg-gray-100">
        <p className="text-gray-500 text-sm md:text-base text-center">
          © 2025 MultiMarket. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </section>
  );
};

export default React.memo(Footer);
