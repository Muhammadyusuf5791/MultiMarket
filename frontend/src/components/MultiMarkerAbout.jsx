import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const MultiMarkerAbout = () => {
  const { t, i18n } = useTranslation();

  // Initialize language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    const lang = savedLang ? JSON.parse(savedLang).text : "uz";
    i18n.changeLanguage(lang);
  }, [i18n]);

  return (
    <div className="px-6 md:px-12 py-6">
      <div className="text-gray-700 text-base md:text-lg max-w-4xl mx-auto">
        <h4 className="text-xl md:text-2xl font-semibold mb-4">
          {t("aboutMarket.title")}
        </h4>
        <p className="mb-4">
          {t("aboutMarket.description")}
        </p>
        <h5 className="text-lg md:text-xl font-medium mb-3">
          {t("aboutMarket.whyChooseUs")}
        </h5>
        <ul className="list-disc list-inside mb-6">
          <li>
            <strong>{t("aboutMarket.features.assortment.title")}:</strong>{" "}
            {t("aboutMarket.features.assortment.description")}
          </li>
          <li>
            <strong>{t("aboutMarket.features.suppliers.title")}:</strong>{" "}
            {t("aboutMarket.features.suppliers.description")}
          </li>
          <li>
            <strong>{t("aboutMarket.features.delivery.title")}:</strong>{" "}
            {t("aboutMarket.features.delivery.description")}
          </li>
          <li>
            <strong>{t("aboutMarket.features.search.title")}:</strong>{" "}
            {t("aboutMarket.features.search.description")}
          </li>
          <li>
            <strong>{t("aboutMarket.features.support.title")}:</strong>{" "}
            {t("aboutMarket.features.support.description")}
          </li>
          <li>
            <strong>{t("aboutMarket.features.discounts.title")}:</strong>{" "}
            {t("aboutMarket.features.discounts.description")}
          </li>
        </ul>
        <h5 className="text-lg md:text-xl font-medium mb-3">
          {t("aboutMarket.categories.title")}
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h6 className="font-semibold">{t("aboutMarket.categories.electrical.title")}</h6>
            <ul className="list-disc list-inside">
              {t("aboutMarket.categories.electrical.items", { returnObjects: true }).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="font-semibold">{t("aboutMarket.categories.plumbing.title")}</h6>
            <ul className="list-disc list-inside">
              {t("aboutMarket.categories.plumbing.items", { returnObjects: true }).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6">
          {t("aboutMarket.footer")}
        </p>
        <button
          className="bg-blue-500 mt-4 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 ease"
          onClick={() => window.location.href = "/register"}
        >
          {t("aboutMarket.registerButton")}
        </button>
      </div>
    </div>
  );
};

export default React.memo(MultiMarkerAbout);