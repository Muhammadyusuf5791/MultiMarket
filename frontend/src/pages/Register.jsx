import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';

const Register = () => {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    age: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setCurrentUser } = useContext(Context);
  const navigate = useNavigate();

  // Initialize language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    const lang = savedLang ? JSON.parse(savedLang).text : "uz";
    i18n.changeLanguage(lang);
  }, [i18n]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim() || form.fullName.length < 3) {
      newErrors.fullName = t("register.errors.fullName", "Full name must be at least 3 characters");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      newErrors.email = t("register.errors.email", "Please enter a valid email");
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = t("register.errors.password", "Password must be at least 6 characters");
    }
    if (form.phone && !/^\+998\d{9}$/.test(form.phone)) {
      newErrors.phone = t("register.errors.phone", "Phone number must start with +998 and contain 9 digits");
    }
    if (form.age && (isNaN(form.age) || form.age < 18 || form.age > 120)) {
      newErrors.age = t("register.errors.age", "Age must be between 18 and 120");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      toast.error(t("register.errors.form", "Please fill all fields correctly"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-red-50 text-red-700 font-medium text-sm rounded-lg",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Firebase Authentication orqali foydalanuvchi yaratish
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        form.email, 
        form.password
      );
      
      const user = userCredential.user;

      // Firebase Auth profilini yangilash
      await updateProfile(user, {
        displayName: form.fullName
      });

      // Firestore'da foydalanuvchi ma'lumotlarini saqlash
      const userData = {
        uid: user.uid,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone || "",
        age: form.age || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", user.uid), userData);

      // Context va localStorage ga foydalanuvchi ma'lumotlarini saqlash
      setCurrentUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      toast.success(t("register.success", "Registration successful"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-green-50 text-green-700 font-medium text-sm rounded-lg",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      
      let errorMessage = t("register.errors.generic", "An error occurred during registration. Please try again.");
      
      // Firebase xatolarini qayta ishlash
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = t("register.errors.emailExists", "This email is already registered!");
          setErrors({ email: errorMessage });
          break;
        case "auth/invalid-email":
          errorMessage = t("register.errors.invalidEmail", "Invalid email address");
          setErrors({ email: errorMessage });
          break;
        case "auth/weak-password":
          errorMessage = t("register.errors.weakPassword", "Password is too weak");
          setErrors({ password: errorMessage });
          break;
        case "auth/network-request-failed":
          errorMessage = t("register.errors.network", "Network error. Please check your connection");
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-red-50 text-red-700 font-medium text-sm rounded-lg",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t("register.title", "Register")}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("register.labels.fullName", "Full Name")}
            </label>
            <input
              type="text"
              name="fullName"
              placeholder={t("register.placeholders.fullName", "First Last Name")}
              value={form.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("register.labels.email", "Email")}
            </label>
            <input
              type="email"
              name="email"
              placeholder={t("register.placeholders.email", "Email")}
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("register.labels.password", "Password")}
            </label>
            <input
              type="password"
              name="password"
              placeholder={t("register.placeholders.password", "Password")}
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("register.labels.phone", "Phone Number (optional)")}
            </label>
            <input
              type="tel"
              name="phone"
              placeholder={t("register.placeholders.phone", "+998901234567")}
              value={form.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("register.labels.age", "Age (optional)")}
            </label>
            <input
              type="number"
              name="age"
              placeholder={t("register.placeholders.age", "Your Age")}
              value={form.age}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.age ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>

          <button
            onClick={handleRegister}
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg font-semibold text-white transition ${
              isSubmitting ? "bg-green-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isSubmitting ? t("register.submitting", "Processing...") : t("register.submit", "Register")}
          </button>

          <p className="text-center text-sm mt-4">
            {t("register.loginPrompt", "Already have an account?")}{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              {t("register.loginLink", "Login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Register);