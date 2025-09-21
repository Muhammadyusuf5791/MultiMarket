import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../context/Context";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    age: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setCurrentUser } = useContext(Context);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim() || form.fullName.length < 3) {
      newErrors.fullName = "To‘liq ism kamida 3 ta belgidan iborat bo‘lishi kerak";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      newErrors.email = "Iltimos, to‘g‘ri email kiriting";
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = "Parol kamida 6 ta belgidan iborat bo‘lishi kerak";
    }
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
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error for the field
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      toast.error("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-red-50 text-red-700 font-medium text-sm rounded-lg",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const exist = users.find((u) => u.email === form.email);
      if (exist) {
        toast.error("Bu email bilan allaqachon ro‘yxatdan o‘tgan!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          className: "bg-red-50 text-red-700 font-medium text-sm rounded-lg",
        });
        setErrors({ email: "Bu email bilan allaqachon ro‘yxatdan o‘tgan!" });
        return;
      }

      const newUser = {
        fullName: form.fullName,
        email: form.email,
        password: form.password, // In production, hash the password
        phone: form.phone || "",
        age: form.age || "",
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      setCurrentUser(newUser);

      toast.success("Ro‘yxatdan o‘tish muvaffaqiyatli", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-green-50 text-green-700 font-medium text-sm rounded-lg",
      });
      navigate("/login");
    } catch (error) {
      toast.error("Ro‘yxatdan o‘tishda xatolik yuz berdi. Qayta urinib ko‘ring.", {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Ro‘yxatdan o‘tish</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To‘liq ism</label>
            <input
              type="text"
              name="fullName"
              placeholder="Ism familiya"
              value={form.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
            <input
              type="password"
              name="password"
              placeholder="Parol"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam (ixtiyoriy)</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Yosh (ixtiyoriy)</label>
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
            onClick={handleRegister}
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg font-semibold text-white transition ${
              isSubmitting ? "bg-green-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isSubmitting ? "Jarayonda..." : "Ro‘yxatdan o‘tish"}
          </button>

          <p className="text-center text-sm mt-4">
            Akkauntingiz bormi?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Register);