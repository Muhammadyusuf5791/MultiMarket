import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cart, placeOrder, currentUser, clearCart } = useContext(Context);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: currentUser?.fullName || "",
    phone: currentUser?.phone || "",
    address: "",
    paymentType: "delivery",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = "To‘liq ism kiritilishi shart";
    if (!form.phone || !/^\+998\d{9}$/.test(form.phone)) {
      newErrors.phone = "Telefon raqami +998 bilan boshlanib, 9 ta raqamdan iborat bo‘lishi kerak";
    }
    if (!form.address) newErrors.address = "Manzil kiritilishi shart";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.warn("Buyurtma berish uchun tizimga kiring", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-yellow-50 text-yellow-700 font-medium text-sm rounded-lg",
      });
      navigate("/login");
      return;
    }
    if (!validateForm()) return;

    try {
      const order = {
        id: Date.now(),
        items: cart,
        total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        createdAt: new Date().toISOString(),
        paymentType: form.paymentType,
        paymentStatus: form.paymentType === "delivery" ? "cash" : "pending",
        status: "pending",
      };
      placeOrder(order);
      clearCart();
      toast.success("Buyurtma muvaffaqiyatli joylashtirildi", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-green-50 text-green-700 font-medium text-sm rounded-lg",
      });
      navigate("/orders");
    } catch (error) {
      toast.error("Buyurtma joylashtirishda xatolik yuz berdi. Qayta urinib ko‘ring.", {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Buyurtma berish</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Savat bo‘sh</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 bg-white shadow-lg p-6 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To‘liq ism</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To‘lov usuli</label>
            <select
              name="paymentType"
              value={form.paymentType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
            >
              <option value="delivery">Naqd pul (haydovchiga)</option>
              <option value="payme">Payme</option>
              <option value="click">Click</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Buyurtma berish
          </button>
        </form>
      )}
    </section>
  );
};

export default React.memo(Checkout);