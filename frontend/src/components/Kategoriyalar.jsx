import React, { useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlBasket } from "react-icons/sl";
import { toast } from "react-toastify";
import Footer from "./Footer";
import Data from "../assets/Data";
import { Context } from "../context/Context";
import Fuse from "fuse.js";
import { useTranslation } from "react-i18next";
import { IoSearchOutline } from "react-icons/io5";

const Kategoriyalar = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useContext(Context);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    const lang = savedLang ? JSON.parse(savedLang).text : "uz";
    i18n.changeLanguage(lang);
  }, [i18n]);

  // ✅ Data ni CHAQIRISH kerak - bu funksiya!
  const data = Data();
  const allProducts = data[0].allProducts;

  // Fuse settings
  const fuse = new Fuse(allProducts, {
    keys: ["title", "description"],
    threshold: 0.4,
  });

  let filteredProducts = allProducts;

  if (searchTerm) {
    filteredProducts = fuse.search(searchTerm).map((result) => result.item);
  }

  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  const handleAddToCart = (item) => {
    addToCart(item);

    let successMessage = "";

    if (i18n.language === "uz") {
      successMessage = `${item.title} savatga qo'shildi`;
    } else if (i18n.language === "ru") {
      successMessage = `${item.title} добавлен в корзину`;
    } else {
      successMessage = `${item.title} added to cart`;
    }

    toast.success(successMessage, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      className: "font-medium text-sm",
    });
  };

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setSearchParams({})}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                !category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {t("categoriesPage.all")}
            </button>
            <button
              onClick={() => setSearchParams({ category: "elektr" })}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                category === "elektr"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {t("categoriesPage.electrical")}
            </button>
            <button
              onClick={() => setSearchParams({ category: "santexnika" })}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                category === "santexnika"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {t("categoriesPage.plumbing")}
            </button>
          </div>

          {/* Search input with icon */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={t("categoriesPage.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm sm:text-base"
            />
            <IoSearchOutline
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <div
                key={item.id}
                className="w-full max-w-[250px] h-[390px] bg-gray-50 rounded-xl flex-shrink-0 shadow-xl mx-auto flex flex-col"
              >
                <div className="w-full h-[200px] bg-gray-100 flex justify-center p-2.5 sm:p-3 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-contain max-h-full"
                  />
                </div>
                
                {/* Title qismi - fixed height bilan */}
                <div className="min-h-[60px] max-h-[60px] overflow-hidden p-2.5 sm:p-3">
                  <h1 className="text-base sm:text-lg font-semibold line-clamp-2 leading-tight">
                    {item.title}
                  </h1>
                </div>
                
                {/* Narx va button - fixed joy */}
                <div className="mt-auto p-2.5 sm:p-3">
                  <p className="font-bold text-blue-500 text-lg sm:text-xl mb-3">
                    {item.price} {t("categoriesPage.currency")}
                  </p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full h-[44px] bg-blue-600 text-white rounded-lg relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 flex items-center justify-center transition-all duration-200 group-hover:opacity-0 text-sm sm:text-base">
                      {t("categoriesPage.addToCart")}
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200 group-hover:opacity-100">
                      <SlBasket size={20} />
                    </span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-sm sm:text-base">
              {t("categoriesPage.noResults")}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default React.memo(Kategoriyalar);