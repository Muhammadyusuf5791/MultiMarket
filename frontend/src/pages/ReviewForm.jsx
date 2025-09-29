import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ReviewForm = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ name: "", review: "" });
  const [errors, setErrors] = useState({ name: "", review: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t("reviewForm.errors.name");
    if (!formData.review.trim()) newErrors.review = t("reviewForm.errors.review");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("reviewForm.errors.fillAll"), {
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
      console.log("Sharh:", formData);

      setSubmitted(true);
      setFormData({ name: "", review: "" });
      setErrors({ name: "", review: "" });

      toast.success(t("reviewForm.success"), {
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
      toast.error(t("reviewForm.error"), {
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
          {t("reviewForm.title")}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-2xl shadow-md space-y-5"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {t("reviewForm.nameLabel")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("reviewForm.namePlaceholder")}
              className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {t("reviewForm.reviewLabel")}
            </label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleChange}
              placeholder={t("reviewForm.reviewPlaceholder")}
              rows="4"
              className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.review ? "border-red-500" : "border-gray-300"
              }`}
              required
            ></textarea>
            {errors.review && (
              <p className="text-red-500 text-sm mt-1">{errors.review}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            disabled={submitted}
          >
            {t("reviewForm.submit")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default React.memo(ReviewForm);
