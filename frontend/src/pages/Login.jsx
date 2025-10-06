import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const Login = () => {
  const { t } = useTranslation();
  const { setCurrentUser } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = t("login.errors.email", "Email is required");
    if (!password.trim()) newErrors.password = t("login.errors.password", "Password is required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      toast.error(t("login.errors.fillAllFields", "Please fill all fields correctly"), {
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
      // Firebase Authentication orqali login qilish
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'dan qo'shimcha foydalanuvchi ma'lumotlarini olish
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentUserData = {
          uid: user.uid,
          fullName: user.displayName || userData.fullName,
          email: user.email,
          phone: userData.phone || "",
          age: userData.age || "",
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        };

        setCurrentUser(currentUserData);
        localStorage.setItem("currentUser", JSON.stringify(currentUserData));

        toast.success(t("login.success", "Login successful!"), {
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
      } else {
        // Agar Firestore'da ma'lumot topilmasa, asosiy ma'lumotlarni saqlaymiz
        const basicUserData = {
          uid: user.uid,
          fullName: user.displayName || "",
          email: user.email,
        };

        setCurrentUser(basicUserData);
        localStorage.setItem("currentUser", JSON.stringify(basicUserData));

        toast.success(t("login.success", "Login successful!"), {
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
      }
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = t("login.errors.general", "An error occurred during login");

      // Firebase xatolarini qayta ishlash
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = t("login.errors.invalidEmail", "Invalid email address");
          setErrors({ email: errorMessage });
          break;
        case "auth/user-disabled":
          errorMessage = t("login.errors.userDisabled", "This account has been disabled");
          break;
        case "auth/user-not-found":
          errorMessage = t("login.errors.userNotFound", "No account found with this email");
          setErrors({ email: errorMessage });
          break;
        case "auth/wrong-password":
          errorMessage = t("login.errors.wrongPassword", "Incorrect password");
          setErrors({ password: errorMessage });
          break;
        case "auth/too-many-requests":
          errorMessage = t("login.errors.tooManyRequests", "Too many attempts. Please try again later");
          break;
        case "auth/network-request-failed":
          errorMessage = t("login.errors.network", "Network error. Please check your connection");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    setErrors({ ...errors, [name]: "" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("login.title", "Login")}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.email", "Email")}
            </label>
            <input
              type="email"
              name="email"
              placeholder={t("login.emailPlaceholder", "Enter your email")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.password", "Password")}
            </label>
            <input
              type="password"
              name="password"
              placeholder={t("login.passwordPlaceholder", "Enter your password")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              value={password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <button
            onClick={handleLogin}
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg font-semibold text-white transition ${
              isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            aria-label={t("login.loginAria", "Login to your account")}
          >
            {isSubmitting ? t("login.loggingIn", "Logging in...") : t("login.login", "Login")}
          </button>
          
          <p className="text-center text-sm mt-4">
            {t("login.noAccount", "Don't have an account?")}{" "}
            <Link to="/register" className="text-green-500 hover:underline font-medium">
              {t("login.register", "Register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);