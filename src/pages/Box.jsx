import React from "react";
import { toast } from "react-toastify";
import Data from "../assets/Data";

const Box = () => {
  const features = Data[0].features;

  const handleLearnMore = (title, desc) => {
    try {
      // Simulate an action (e.g., logging or future API call)
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
    } catch (error) {
      console.error(error);
      toast.error("Ma'lumotni olishda xatolik yuz berdi. Qayta urinib ko‘ring.", {
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
    <section className="w-full py-16 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow p-6 text-center transform transition-transform duration-300"
            >
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
                aria-label={f.title}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
              <button
                onClick={() => handleLearnMore(f.title, f.desc)}
                className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                aria-label={`Learn more about ${f.title}`}
              >
                Batafsil
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Box);