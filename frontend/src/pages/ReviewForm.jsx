// ReviewForm.js
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { FaStar, FaRegStar } from "react-icons/fa";

const ReviewForm = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ 
    name: "", 
    review: "", 
    rating: 0 
  });
  const [errors, setErrors] = useState({ name: "", review: "", rating: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleRating = (rating) => {
    setFormData({ ...formData, rating });
    setErrors({ ...errors, rating: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t("reviewForm.errors.name");
    if (!formData.review.trim()) newErrors.review = t("reviewForm.errors.review");
    if (formData.review.trim().length < 10) newErrors.review = t("reviewForm.errors.reviewShort");
    if (formData.rating === 0) newErrors.rating = t("reviewForm.errors.rating");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      toast.error(t("reviewForm.errors.fillAll"), {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "testimonials"), {
        author: formData.name.trim(),
        text: formData.review.trim(),
        rating: formData.rating,
        approved: false,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({ name: "", review: "", rating: 0 });
      setErrors({ name: "", review: "", rating: "" });

      toast.success(t("reviewForm.success"), {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Xatolik:", error);
      toast.error(t("reviewForm.error"), {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, hoverRating, onHoverChange }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => onHoverChange(star)}
            onMouseLeave={() => onHoverChange(0)}
            className="text-2xl focus:outline-none transition-transform hover:scale-110"
            disabled={submitted || loading}
          >
            {star <= (hoverRating || rating) ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
          {t("reviewForm.title")}
        </h2>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl shadow-md space-y-5">
          {/* Reyting qismi */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">
              {t("reviewForm.ratingLabel")}
            </label>
            <div className="flex items-center space-x-4">
              <StarRating
                rating={formData.rating}
                onRatingChange={handleRating}
                hoverRating={hoverRating}
                onHoverChange={setHoverRating}
              />
              <span className="text-sm text-gray-600">
                {formData.rating > 0 && `${formData.rating} / 5`}
              </span>
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Ism qismi */}
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
              disabled={submitted || loading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Sharh qismi */}
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
              disabled={submitted || loading}
            ></textarea>
            {errors.review && <p className="text-red-500 text-sm mt-1">{errors.review}</p>}
          </div>

          {/* Submit tugmasi */}
          <button
            type="submit"
            className={`w-full font-semibold py-3 rounded-lg transition ${
              submitted || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={submitted || loading}
          >
            {loading ? t("reviewForm.submitting") : 
             submitted ? t("reviewForm.submitted") : t("reviewForm.submit")}
          </button>

          {submitted && (
            <p className="text-green-600 text-sm text-center">
              {t("reviewForm.awaitingApproval")}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default React.memo(ReviewForm);