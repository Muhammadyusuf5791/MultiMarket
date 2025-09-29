import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation files
import uz from "../Language/uz/translation.json";
import ru from "../Language/ru/translation.json";
import en from "../Language/en/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: "uz", // Default language
  fallbackLng: "uz",
  interpolation: {
    escapeValue: false, // React already escapes XSS
  },
});

export default i18n;