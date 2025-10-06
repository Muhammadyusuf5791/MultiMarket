import React, { useContext, useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, NavLink } from "react-router-dom";
import uzb from "../assets/logo1.png";
import rus from "../assets/logo2.png";
import eng from "../assets/logo3.png";
import profil_icon from "../assets/profile_icon.png";
import cart_icon from "../assets/cart_icon.png";
import logo4 from "../assets/logo4.png";
import { Context } from "../context/Context";
import { useTranslation } from "react-i18next";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { count, currentUser, setCurrentUser } = useContext(Context);
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    return savedLang ? JSON.parse(savedLang) : { img: uzb, text: "uz" };
  });

  // Initialize language only on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang) {
      const { text } = JSON.parse(savedLang);
      if (text !== i18n.language) {
        i18n.changeLanguage(text);
      }
    }
  }, [i18n]);

  const languages = [
    { img: uzb, text: "uz" },
    { img: rus, text: "ru" },
    { img: eng, text: "en" },
  ];

  const handleLanguageChange = (lang) => {
    setSelected(lang);
    i18n.changeLanguage(lang.text);
    localStorage.setItem("selectedLanguage", JSON.stringify(lang));
    setOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      setMenuOpen(false);
      
      toast.success(t("logout.success", "Logged out successfully"), {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t("logout.error", "Error during logout"), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const navLinks = [
    { path: "/", label: t("home", "Home") },
    { path: "/sohalar", label: t("categories", "Categories") },
    { path: "/about", label: t("about", "About") },
    { path: "/contact", label: t("contact", "Contact") },
  ];

  const profileLinks = currentUser
    ? [
        { path: "/profile", label: t("profile", "My Profile") },
        { path: "/orders", label: t("orders", "Orders") },
        { 
          path: "/", 
          label: t("logout", "Logout"), 
          className: "text-red-500", 
          onClick: handleLogout 
        },
      ]
    : [
        { path: "/login", label: t("login.title", "Login") },
        { path: "/register", label: t("navbar.register", "Register"), className: "text-blue-500" },
      ];

  return (
    <section className="border-b">
      <header className="w-full flex items-center justify-between px-4 sm:px-6 md:px-10 py-3">
        <div className="w-28 sm:w-36 md:w-44 lg:w-48">
          <Link to="/">
            <img src={logo4} alt="logo" className="w-full" />
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 font-medium text-slate-700">
          {navLinks.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              className={({ isActive }) =>
                `relative pb-1 transition-colors ${
                  isActive ? "text-blue-600" : "hover:text-blue-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-0.5 bg-blue-500 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-5">
          <div className="hidden md:flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src={profil_icon}
                  alt="profile"
                  className="w-5"
                />
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20">
                <ul className="flex flex-col text-sm py-1">
                  {profileLinks.map((link, i) => (
                    <li
                      key={i}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${link.className || ""}`}
                      onClick={link.onClick}
                    >
                      {link.onClick ? (
                        <span className="block w-full">{link.label}</span>
                      ) : (
                        <Link to={link.path} className="block w-full">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cart Icon */}
            <Link to="/cart">
              <div className="relative cursor-pointer">
                <img src={cart_icon} alt="cart" className="w-5" />
                <span className="absolute -bottom-1 -right-1 bg-black text-[10px] sm:text-[11px] text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              </div>
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1 rounded-full cursor-pointer shadow-sm"
              >
                <img
                  src={selected.img}
                  alt=""
                  width="20"
                  className="rounded-full"
                />
                {selected.text.toUpperCase()}
              </button>

              {open && (
                <ul className="absolute top-full right-0 bg-white border border-gray-200 rounded-lg mt-2 shadow-lg w-28 z-20">
                  {languages.map((lang, i) => (
                    <li
                      key={i}
                      onClick={() => handleLanguageChange(lang)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                    >
                      <img
                        src={lang.img}
                        alt=""
                        width="20"
                        className="rounded-full"
                      />
                      {lang.text.toUpperCase()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Mobile View */}
          <div className="flex md:hidden items-center gap-3">
            {/* Cart for Mobile */}
            <Link to="/cart">
              <div className="relative cursor-pointer">
                <img src={cart_icon} alt="cart" className="w-5" />
                <span className="absolute -bottom-1 -right-1 bg-black text-[9px] text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              </div>
            </Link>

            {/* Language Selector for Mobile */}
            <button
              className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1 rounded-full cursor-pointer shadow-sm"
              onClick={() => setOpen(!open)}
            >
              <img
                src={selected.img}
                alt=""
                width="18"
                className="rounded-full"
              />
              {selected.text.toUpperCase()}
            </button>

            {/* Menu Toggle */}
            <button className="text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Language Selector */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-md py-4">
          <div className="flex justify-center gap-3">
            {languages.map((lang, i) => (
              <button
                key={i}
                onClick={() => handleLanguageChange(lang)}
                className={`flex items-center gap-1 px-3 py-1 border rounded-full text-sm ${
                  selected.text === lang.text
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <img
                  src={lang.img}
                  alt={lang.text}
                  width="18"
                  className="rounded-full"
                />
                {lang.text.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <nav className="flex flex-col items-center gap-4 py-4 font-medium text-slate-700">
            {/* Main Navigation Links */}
            {navLinks.map((link, i) => (
              <NavLink
                key={i}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "text-blue-600" : "hover:text-blue-500"
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* User Info in Mobile Menu */}
            {currentUser && (
              <div className="text-center border-t pt-4 mt-2 w-full">
                <p className="text-sm text-gray-600">
                  {t("navbar.welcome", "Welcome")},
                </p>
                <p className="font-medium text-gray-800 truncate max-w-xs">
                  {currentUser.fullName || currentUser.email}
                </p>
              </div>
            )}

            {/* Profile Links */}
            {profileLinks.map((link, i) => (
              <NavLink
                key={i}
                to={link.path}
                onClick={() => {
                  setMenuOpen(false);
                  if (link.onClick) link.onClick();
                }}
                className={({ isActive }) =>
                  `hover:text-blue-500 ${link.className || ""} ${isActive ? "text-blue-600" : ""}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </section>
  );
};

export default React.memo(Navbar);