import React from "react";

const MultiMarkerAbout = () => {
  return (
    <div className="px-6 md:px-12 py-6">
      <div className="text-gray-700 text-base md:text-lg max-w-4xl mx-auto">
        <h4 className="text-xl md:text-2xl font-semibold mb-4">
          MultiMarket haqida ko'proq ma'lumot
        </h4>
        <p className="mb-4">
          MultiMarket — bu elektr va santexnika mahsulotlari uchun yetakchi onlayn platforma bo'lib, mijozlarga yuqori sifatli mahsulotlarni qulay narxlarda taqdim etadi. Bizning maqsadimiz — xaridorlarga o'z ehtiyojlariga mos mahsulotlarni osongina topish va xavfsiz xarid qilish imkoniyatini berish.
        </p>
        <h5 className="text-lg md:text-xl font-medium mb-3">
          Nima uchun MultiMarketni tanlash kerak?
        </h5>
        <ul className="list-disc list-inside mb-6">
          <li>
            <strong>Keng assortiment:</strong> Elektr jihozlari (rozetkalar, kalitlar, kabellar, chiroqlar) va santexnika mahsulotlari (trubalar, kranlar, dush kabinalari, vannalar) kabi minglab mahsulotlar.
          </li>
          <li>
            <strong>Ishonchli sotuvchilar:</strong> Faqat tasdiqlangan va sifatli mahsulotlar taqdim etuvchi yetkazib beruvchilar bilan hamkorlik.
          </li>
          <li>
            <strong>Tezkor yetkazib berish:</strong> O'zbekiston, Namangan bo'ylab 1-2 soat ichida yetkazib berish xizmati.
          </li>
          <li>
            <strong>Oson qidiruv tizimi:</strong> Mahsulotlarni toifalar, brendlar va narxlar bo'yicha filtrlab topish imkoniyati.
          </li>
          <li>
            <strong>24/7 mijozlar xizmati:</strong> Har qanday savol yoki muammolar uchun doimiy qo'llab-quvvatlash.
          </li>
          <li>
            <strong>Aktsiyalar va chegirmalar:</strong> Doimiy ravishda yangilanadigan maxsus takliflar va chegirmalar, shu jumladan 2,000,000 UZS dan yuqori xaridlarga 12% gacha chegirma.
          </li>
        </ul>
        <h5 className="text-lg md:text-xl font-medium mb-3">
          Bizning mahsulot toifalarimiz
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h6 className="font-semibold">Elektr mahsulotlari:</h6>
            <ul className="list-disc list-inside">
              <li>Kabellar va simlar</li>
              <li>Rozetkalar va kalitlar</li>
              <li>LED chiroqlar va lampalar</li>
              <li>Elektr panellari va avtomatlar</li>
              <li>Generatolar va stabilizatorlar</li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold">Santexnika mahsulotlari:</h6>
            <ul className="list-disc list-inside">
              <li>Kranlar va smesitellar</li>
              <li>Trubalar va fittinglar</li>
              <li>Vannalar va dush kabinalari</li>
              <li>Unitazlar va rakovinalar</li>
              <li>Suv isitgichlar va nasoslar</li>
            </ul>
          </div>
        </div>
        <p className="mt-6">
          MultiMarket bilan xarid qilish — bu qulaylik, sifat va ishonch demakdir! Bugun ro'yxatdan o'ting va eng yaxshi takliflarni kashf eting.
        </p>
        <button
          className="bg-blue-500 mt-4 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 ease"
          onClick={() => window.location.href = "/register"}
        >
          Ro'yxatdan o'tish
        </button>
      </div>
    </div>
  );
};

export default React.memo(MultiMarkerAbout)
