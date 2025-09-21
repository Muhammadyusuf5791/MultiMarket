import React, { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlBasket } from "react-icons/sl";
import { toast } from "react-toastify"; // Import toast only
import Footer from "./Footer";
import Data from "../assets/Data";
import { Context } from "../context/Context";
import Fuse from "fuse.js";

const Kategoriyalar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useContext(Context);

  const allProducts = Data[0].allProducts;

  // Fuse sozlamalari
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
    toast.success(`${item.title} savatga qo'shildi`, {
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
                !category ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Barchasi
            </button>
            <button
              onClick={() => setSearchParams({ category: "elektr" })}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                category === "elektr" ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Elektr mahsulotlari
            </button>
            <button
              onClick={() => setSearchParams({ category: "santexnika" })}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                category === "santexnika" ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Santexnika mahsulotlari
            </button>
          </div>

          <input
            type="text"
            placeholder="Mahsulot qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm sm:text-base"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <div
                key={item.id}
                className="w-full max-w-[250px] h-[390px] bg-gray-50 rounded-xl flex-shrink-0 shadow-xl mx-auto"
              >
                <div className="w-full h-[200px] bg-gray-100 flex justify-center p-2.5 sm:p-3 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-contain max-h-full"
                  />
                </div>
                <h1 className="text-base sm:text-lg font-semibold p-2.5 sm:p-3 line-clamp-2">
                  {item.title}
                </h1>
                <p className="pt-10 sm:pt-12 pl-2.5 sm:pl-3 font-bold text-blue-500 text-lg sm:text-xl">
                  {item.price.toLocaleString()} so'm
                </p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full h-[44px] bg-blue-600 text-white mt-4 sm:mt-5 rounded-lg relative overflow-hidden group"
                >
                  <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:opacity-0 text-sm sm:text-base">
                    Savatga qo'shish
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <SlBasket size={20} />
                  </span>
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-sm sm:text-base">
              Hech narsa topilmadi
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default React.memo(Kategoriyalar);