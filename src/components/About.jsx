import React from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBolt, FaTruck, FaCheckCircle, FaHeadset } from "react-icons/fa"; // Importing icons

const About = () => {
  const { t } = useTranslation();

  // Array of icons to match each feature
  const featureIcons = [
    <FaBolt className="text-blue-600 text-xl" />,
    <FaTruck className="text-blue-600 text-xl" />,
    <FaCheckCircle className="text-blue-600 text-xl" />,
    <FaHeadset className="text-blue-600 text-xl" />,
  ];

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 py-12">
        {/* Sarlavha */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t("aboutPage.title")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("aboutPage.description")}
          </p>
        </div>

        {/* Asosiy kontent */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Chap taraf */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {t("aboutPage.whyChooseUs")}
            </h2>
            <ul className="space-y-3 text-gray-600">
              {[
                "feature1",
                "feature2",
                "feature3",
                "feature4",
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition-all duration-300"
                >
                  {featureIcons[index]}
                  <span>{t(`aboutPage.features.${feature}`)}</span>
                </li>
              ))}
            </ul>

            <button
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
              aria-label={t("aboutPage.contactAria")}
            >
              <Link to="/contact">{t("aboutPage.contact")}</Link>
            </button>
          </div>

          {/* O‘ng taraf rasm */}
          <div className="flex justify-center">
            <img
              src="https://img.freepik.com/free-vector/business-team-concept-illustration_114360-678.jpg"
              alt={t("aboutPage.imageAlt")}
              className="rounded-2xl shadow-lg w-full md:w-4/5"
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default React.memo(About);