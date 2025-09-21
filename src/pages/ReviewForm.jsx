import React, { useState } from "react";
import { toast } from "react-toastify";

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    review: "",
  });
  const [errors, setErrors] = useState({ name: "", review: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Ismingizni kiriting";
    if (!formData.review.trim()) newErrors.review = "Sharhingizni yozing";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Iltimos, barcha maydonlarni to‘ldiring.", {
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

    try {
      // Simulate backend submission (replace with actual API call in production)
      console.log("Sharh:", formData);

      setSubmitted(true);
      setFormData({ name: "", review: "" });
      setErrors({ name: "", review: "" });
      toast.success("Sharhingiz qabul qilindi", {
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
      toast.error("Sharh yuborishda xatolik yuz berdi. Qayta urinib ko‘ring.", {
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

  return (
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
          Sharh qoldirishingiz mumkin!
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-2xl shadow-md space-y-5"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Ismingiz
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ismingizni kiriting"
              className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Sharhingiz
            </label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleChange}
              placeholder="Fikringizni yozing..."
              rows="4"
              className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.review ? "border-red-500" : "border-gray-300"
              }`}
              required
            ></textarea>
            {errors.review && <p className="text-red-500 text-sm mt-1">{errors.review}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            disabled={submitted}
          >
            Yuborish
          </button>
        </form>
      </div>
    </section>
  );
};

export default React.memo(ReviewForm);