import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const { setCurrentUser } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = t("login.errors.email");
    if (!password.trim()) newErrors.password = t("login.errors.password");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      toast.error(t("login.errors.fillAllFields"), {
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

    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const exist = users.find((u) => u.email === email && u.password === password);

      if (!exist) {
        toast.error(t("login.errors.invalidCredentials"), {
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

      setCurrentUser(exist);
      toast.success(t("login.success"), {
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
      toast.error(t("login.errors.general"), {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    setErrors({ ...errors, [name]: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">{t("login.title")}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("login.email")}</label>
            <input
              type="email"
              name="email"
              placeholder={t("login.emailPlaceholder")}
              className={`w-full border rounded-md px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("login.password")}</label>
            <input
              type="password"
              name="password"
              placeholder={t("login.passwordPlaceholder")}
              className={`w-full border rounded-md px-3 py-2 mb-1 focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              value={password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            aria-label={t("login.loginAria")}
          >
            {t("login.login")}
          </button>
          <p className="text-center text-sm mt-4">
            {t("login.noAccount")}{" "}
            <Link to="/register" className="text-green-500 hover:underline">
              {t("login.register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);