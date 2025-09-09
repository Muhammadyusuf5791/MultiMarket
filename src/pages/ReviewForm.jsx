import React, { useState } from "react";

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    review: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.name.trim() && formData.review.trim()) {
      // Bu yerda backendga yuborishingiz yoki console.log qilishingiz mumkin
      console.log("Sharh:", formData);

      setSubmitted(true);
      setFormData({ name: "", review: "" });
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
          Sharh qoldirishingiz mumkin!
        </h2>

        {submitted && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            ✅ Sharhingiz qabul qilindi!
          </div>
        )}

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
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
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
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Yuborish
          </button>
        </form>
      </div>
    </section>
  );
};

export default React.memo(ReviewForm);
