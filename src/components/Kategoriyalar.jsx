import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { SlBasket } from "react-icons/sl";
import Footer from "./Footer";
import Data from "../assets/Data";
import { Context } from "../context/Context";

const Kategoriyalar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");

  // Contextdan kerakli funksiyalarni olish
  const { addToCart } = useContext(Context);

  const allProducts = Data[0].allProducts;

  // Filtrlash
  const filteredProducts = category
    ? allProducts.filter((p) => p.category === category)
    : allProducts;

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 py-12">
        {/* Filter tugmalar */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              !category ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Barchasi
          </button>
          <button
            onClick={() => setSearchParams({ category: "elektr" })}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              category === "elektr" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Elektr mahsulotlari
          </button>
          <button
            onClick={() => setSearchParams({ category: "santexnika" })}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              category === "santexnika"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Santexnika mahsulotlari
          </button>
        </div>

        {/* Mahsulotlar grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="w-[250px] h-[390px] bg-gray-50 rounded-xl flex-shrink-0 shadow-xl mx-auto"
            >
              {/* Rasm */}
              <div className="w-full h-[200px] bg-gray-100 flex justify-center p-[10px] rounded-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-contain"
                />
              </div>

              {/* Nomi */}
              <h1 className="text-lg font-semibold p-[10px]">{item.title}</h1>

              {/* Narx */}
              <p className="pt-[50px] pl-[10px] font-bold text-blue-500 text-xl">
                {item.price} so'm
              </p>

              {/* Tugma */}
              <button
                onClick={() => addToCart(item)} 
                className="w-full h-[44px] bg-blue-600 text-white mt-[20px] rounded-lg relative overflow-hidden group"
              >
                {/* Text */}
                <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:opacity-0">
                  Savatga qo'shish
                </span>
                {/* Icon */}
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <SlBasket size={20} />
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default React.memo(Kategoriyalar);
