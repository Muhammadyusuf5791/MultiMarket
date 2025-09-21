import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import { GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast

const CartTotal = () => {
  const {
    cart,
    count,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(Context);

  const navigate = useNavigate();

  // Chegirma foizlari
  const DISCOUNT_THRESHOLDS = [
    { amount: 2000000, discount: 12 },
    { amount: 1000000, discount: 8 },
    { amount: 500000, discount: 5 },
  ];

  // Jami summani hisoblash
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Chegirma miqdorini hisoblash
  const calculateDiscount = (totalAmount) => {
    for (const threshold of DISCOUNT_THRESHOLDS) {
      if (totalAmount >= threshold.amount) {
        return {
          percentage: threshold.discount,
          amount: Math.round((totalAmount * threshold.discount) / 100),
        };
      }
    }
    return { percentage: 0, amount: 0 };
  };

  const discount = calculateDiscount(total);
  const finalTotal = total - discount.amount;

  // Handle remove from cart with toast
  const handleRemoveFromCart = (itemId, title) => {
    try {
      removeFromCart(itemId);
      toast.success(`${title} savatdan o‘chirildi`, {
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
      toast.error("Mahsulotni o‘chirishda xatolik yuz berdi.", {
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

  // Handle increase quantity with toast
  const handleIncreaseQuantity = (itemId, title) => {
    try {
      increaseQuantity(itemId);
      toast.success(`${title} miqdori yangilandi`, {
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
      toast.error("Miqdor yangilashda xatolik yuz berdi.", {
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

  // Handle decrease quantity with toast
  const handleDecreaseQuantity = (itemId, title) => {
    try {
      decreaseQuantity(itemId);
      toast.success(`${title} miqdori yangilandi`, {
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
      toast.error("Miqdor yangilashda xatolik yuz berdi.", {
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

  // Handle clear cart with toast
  const handleClearCart = () => {
    try {
      clearCart();
      toast.success("Savat tozalandi", {
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
      toast.error("Savatni tozalashda xatolik yuz berdi.", {
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center text-2xl font-semibold py-10 text-gray-700">
            Savat bo'sh ({count})
          </h2>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <section className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Savatingizda ({count})</h2>
          <button
            onClick={handleClearCart}
            className="text-red-500 font-bold cursor-pointer hover:text-red-700 transition"
          >
            Barchasini o'chirish
          </button>
        </div>

        <div className="grid gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md p-4 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-contain rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-blue-600 font-bold">
                    {item.price.toLocaleString()} so'm × {item.quantity}
                  </p>
                </div>
              </div>

              {/* Quantity control */}
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <button
                  onClick={() => handleDecreaseQuantity(item.id, item.title)}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  –
                </button>
                <span className="font-bold w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => handleIncreaseQuantity(item.id, item.title)}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>

              {/* Narx va o'chirish */}
              <div className="flex items-center gap-4">
                <p className="font-bold text-lg">
                  {(item.price * item.quantity).toLocaleString()} so'm
                </p>
                <button
                  onClick={() => handleRemoveFromCart(item.id, item.title)}
                  className="text-xl"
                >
                  <GoTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Chegirma ma'lumotlari va umumiy narx */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Buyurtma xulosasi</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Mahsulotlar jami:</span>
              <span className="font-medium">{total.toLocaleString()} so'm</span>
            </div>

            {discount.percentage > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{discount.percentage}% chegirma:</span>
                <span className="font-medium">-{discount.amount.toLocaleString()} so'm</span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>To'lov miqdori:</span>
                <span>{finalTotal.toLocaleString()} so'm</span>
              </div>
            </div>
          </div>

          {/* Chegirma progress bar */}
          {discount.percentage === 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Chegirma olishingiz mumkin!</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${Math.min(100, (total / 500000) * 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-700 mt-2">
                {total < 500000
                  ? `Yana ${(500000 - total).toLocaleString()} so'm xarid qiling va 5% chegirma oling`
                  : "Siz 5% chegirma olish huquqiga egasiz!"}
              </p>
            </div>
          )}

          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
          >
            Buyurtma berish
          </button>
        </div>
      </section>
    </div>
  );
};

export default React.memo(CartTotal);