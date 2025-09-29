import { useTranslation } from "react-i18next";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import img5 from "../assets/img5.png";
import img6 from "../assets/img6.png";
import img7 from "../assets/img7.png";
import { FaTruck, FaCheckCircle, FaCreditCard, FaStar } from "react-icons/fa";

const Data = () => {
  const { t } = useTranslation();

  return [
    {
      category: [
        {
          id: 1,
          title: t("categoriesData.uzo_avtamat"),
          price: "50,000",
          image: img3,
        },
        {
          id: 2,
          title: t("categoriesData.avtamat_16c"),
          price: "30,000",
          image: img2,
        },
        {
          id: 3,
          title: t("categoriesData.schotchik"),
          price: "210,000",
          image: img4,
        },
        {
          id: 4,
          title: t("categoriesData.traynoy_d25"),
          price: "1,000",
          image: img6,
        },
        {
          id: 5,
          title: t("categoriesData.dazmol"),
          price: "150,000",
          image: img7,
        },
        {
          id: 6,
          title: t("categoriesData.d32_valf"),
          price: "50,000",
          image: img5,
        },
      ],
      bestSeller: [
        {
          id: 1,
          title: t("categoriesData.uzo_avtamat"),
          price: "50,000",
          image: img3,
        },
        {
          id: 2,
          title: t("categoriesData.avtamat_16c"),
          price: "30,000",
          image: img2,
        },
        {
          id: 4,
          title: t("categoriesData.traynoy_d25"),
          price: "1,000",
          image: img6,
        },
        {
          id: 6,
          title: t("categoriesData.d32_valf"),
          price: "50,000",
          image: img5,
        },
      ],
      // Data.js da features qismi
      features: [
        {
          id: 11,
          icon: <FaTruck size={32} className="text-blue-600" />,
          title: t("featuresData.fast_delivery"),
          desc: t("featuresData.fast_delivery_desc"),
        },
        {
          id: 12,
          icon: <FaCheckCircle size={32} className="text-blue-600" />,
          title: t("featuresData.reliable_sellers"),
          desc: t("featuresData.reliable_sellers_desc"),
        },
        {
          id: 13,
          icon: <FaCreditCard size={32} className="text-blue-600" />,
          title: t("featuresData.secure_payment"),
          desc: t("featuresData.secure_payment_desc"),
        },
        {
          id: 14,
          icon: <FaStar size={32} className="text-blue-600" />,
          title: t("featuresData.quality_guarantee"),
          desc: t("featuresData.quality_guarantee_desc"),
        },
      ],
      testimonials: [
        { id: 15, text: t("testimonialsData.azizbek"), author: "— Azizbek" },
        {
          id: 16,
          text: t("testimonialsData.muhammad"),
          author: "— Muhammadyusuf",
        },
        { id: 17, text: t("testimonialsData.jamshid"), author: "— Jamshid" },
      ],
      allProducts: [
        {
          id: 6,
          title: t("categoriesData.d32_valf"),
          price: "50,000",
          image: img5,
          category: "santexnika",
        },
        {
          id: 4,
          title: t("categoriesData.traynoy_d25"),
          price: "1,000",
          image: img6,
          category: "santexnika",
        },
        {
          id: 1,
          title: t("categoriesData.uzo_avtamat"),
          price: "50,000",
          image: img3,
          category: "elektr",
        },
        {
          id: 5,
          title: t("categoriesData.dazmol"),
          price: "150,000",
          image: img7,
          category: "santexnika",
        },
        {
          id: 2,
          title: t("categoriesData.avtamat_16c"),
          price: "30,000",
          image: img2,
          category: "elektr",
        },
        {
          id: 3,
          title: t("categoriesData.schotchik"),
          price: "210,000",
          image: img4,
          category: "elektr",
        },
      ],
    },
  ];
};

export default Data;
