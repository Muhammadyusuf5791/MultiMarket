import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Data from "../assets/Data";
import { SlBasket } from "react-icons/sl";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Category = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState([]);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(Context); // 🛒 Contextdan funksiya olish
  const category1 = Data[0].category;

  useEffect(() => {
    axios
      .post("https://jsonplaceholder.typicode.com/posts", category1)
      .then(() => {
        setCategory(category1);
      })
      .catch((err) => {
        console.error(err);
        setError(t("category.fetchError"));
        toast.error(t("category.fetchErrorToast"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          className: "bg-red-50 text-red-700 font-medium text-sm rounded-lg",
        });
      });
  }, []);

  const handleAddToCart = (item) => {
    try {
      addToCart(item);
      toast.success(t("category.addToCartSuccess", { title: item.title }), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-green-50 text-green-700 font-medium text-sm rounded-lg",
      });
    } catch (error) {
      console.error(error);
      toast.error(t("category.addToCartError"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-red-50 text-red-700 font-medium text-sm rounded-lg",
      });
    }
  };

  if (error) return null; // Toast handles the error display

  return (
    <section className="p-[40px] pb-0">
      <h1 className="pb-10 sm:pb-12 md:pb-16 text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
        {t("category.title")}
      </h1>

      <div className="w-full flex gap-[40px] overflow-x-auto scrollbar-hide pb-[40px]">
        {category.map((item) => (
          <div
            key={item.id}
            className="w-[250px] h-[390px] bg-gray-50 rounded-xl flex-shrink-0 shadow-xl"
          >
            <div className="w-full h-[200px] bg-gray-100 flex justify-center p-[10px] rounded-lg">
              <img
                src={item.image}
                alt={t("category.productAlt", { title: item.title })}
                className="object-contain"
              />
            </div>

            <h1 className="text-lg font-semibold p-[10px]">{item.title}</h1>
            <p className="pt-[50px] pl-[10px] font-bold text-blue-500 text-xl">
              {item.price} {t("category.currency")}
            </p>

            {/* 🛒 Savatga qo‘shish tugmasi */}
            <button
              onClick={() => handleAddToCart(item)}
              className="w-full h-[44px] bg-blue-600 text-white mt-[20px] rounded-lg relative overflow-hidden group"
              aria-label={t("category.addToCartAria", { title: item.title })}
            >
              <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:opacity-0">
                {t("category.addToCart")}
              </span>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                <SlBasket size={20} />
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(Category);