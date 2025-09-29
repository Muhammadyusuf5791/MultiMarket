import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Data from "../assets/Data";

const Box = () => {
  const { t } = useTranslation();

  const data = Data();
  const features = data?.[0]?.features || [];

  const handleLearnMore = (title, desc) => {
    console.log(`Learn more about: ${title}`);
    toast.info(desc, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      className: "bg-blue-50 text-blue-700 font-medium text-sm rounded-lg",
    });
  };

  if (!features || features.length === 0) {
    return (
      <section className="w-full py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-600">{t("boxData.noFeatures")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* ✅ KATTA SARLAVHA QO'SHILDI */}
        <h1 className="pb-10 sm:pb-12 md:pb-16 text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          {t("boxData.title")}
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 p-6 text-center"
            >
              <div
                className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gray-100"
                aria-label={t("boxData.iconAria", { title: f.title })}
              >
                {f.icon}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3 min-h-[60px]">
                {f.desc}
              </p>
              <button
                onClick={() => handleLearnMore(f.title, f.desc)}
                className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                aria-label={t("boxData.learnMoreAria", { title: f.title })}
              >
                {t("boxData.learnMore")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Box);