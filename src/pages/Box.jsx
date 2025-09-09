import React from "react";
import Data from '../assets/Data'

const Box = () => {
    const features = Data[0].features
  return (
    <section className="w-full py-16 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Box);
