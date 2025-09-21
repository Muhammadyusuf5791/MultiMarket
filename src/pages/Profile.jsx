import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(Context);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    age: currentUser?.age || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (form.phone && !/^\+998\d{9}$/.test(form.phone)) {
      newErrors.phone = "Telefon raqami +998 bilan boshlanib, 9 ta raqamdan iborat bo‘lishi kerak";
    }
    if (form.age && (isNaN(form.age) || form.age < 18 || form.age > 120)) {
      newErrors.age = "Yosh 18 dan 120 gacha bo‘lishi kerak";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const updatedUser = {
        ...currentUser,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        age: form.age,
      };
      setCurrentUser(updatedUser);

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.map((user) =>
        user.email === currentUser.email ? updatedUser : user
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      toast.success("Profil muvaffaqiyatli yangilandi", {
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
      toast.error("Profilni yangilashda xatolik yuz berdi. Qayta urinib ko‘ring.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-red-50 text-red-700 font-medium text-sm rounded-lg",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Profil topilmadi</h2>
        <p className="text-gray-600 mb-6">Iltimos, tizimga kiring.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Kirish
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">Mening profilim</h2>

      {errors.general && (
        <p className="text-red-500 text-center mb-4 bg-red-50 p-2 rounded">{errors.general}</p>
      )}

      <form onSubmit={handleSave} className="grid gap-4 bg-white shadow-lg p-6 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To‘liq ism</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam</label>
          <input
            type="tel"
            name="phone"
            placeholder="+998901234567"
            value={form.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yosh</label>
          <input
            type="number"
            name="age"
            placeholder="Yoshingiz"
            value={form.age}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.age ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${
            isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </section>
  );
};

export default React.memo(Profile);