import React, { useContext, useState } from "react";
import { IoLocationOutline, IoChevronDownOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import uzb from "../assets/logo1.png";
import rus from "../assets/logo2.png";
import eng from "../assets/logo3.png";
import profil_icon from "../assets/profile_icon.png";
import cart_icon from "../assets/cart_icon.png";
import search_icon from "../assets/search_icon.png";
import logo4 from "../assets/logo4.png";
import { Link, NavLink } from "react-router-dom";
import { Context } from "../context/Context";
import CartTotal from "../pages/CartTotal";

const Navbar = () => {
  const [open, setOpen] = useState(false); // language dropdown
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [selected, setSelected] = useState({ img: uzb, text: "UZ" });

  const { count } = useContext(Context);

  const languages = [
    { img: uzb, text: "UZ" },
    { img: rus, text: "RU" },
    { img: eng, text: "EN" },
  ];

  return (
    <section className="border-b">
      {/* Top bar */}
      <section className="w-full flex flex-col md:flex-row md:justify-between items-center px-4 md:px-10 py-2 bg-gray-100 gap-2 text-sm">
        <div className="flex items-center gap-5">
          <p className="flex items-center gap-1 cursor-pointer">
            <IoLocationOutline className="text-lg" /> Namangan
            <IoChevronDownOutline className="text-lg" />
          </p>
          <p className="cursor-pointer">Sotuv punktlari</p>
        </div>

        <div className="flex items-center gap-5">
          <p className="cursor-pointer">Savol-javob</p>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1 rounded-md cursor-pointer"
            >
              <img src={selected.img} alt="" width="20" /> {selected.text}
              <IoChevronDownOutline className="text-gray-600" />
            </button>

            {open && (
              <ul className="absolute top-full right-0 bg-white border border-gray-200 rounded-md mt-2 shadow-lg w-24 z-10">
                {languages.map((lang, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setSelected(lang);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    <img src={lang.img} alt="" width="20" /> {lang.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Header */}
      <header className="w-full flex items-center justify-between px-4 md:px-10 py-3">
        {/* Logo */}
        <div className="w-40 md:w-48">
          <Link to="/">
            <img src={logo4} alt="logo" className="w-full" />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 font-medium text-slate-700">
          {["/", "/sohalar", "/about", "/contact"].map((path, i) => {
            const labels = [
              "Bosh sahifa",
              "Kategoriyalar",
              "Biz haqimizda",
              "Aloqa",
            ];
            return (
              <NavLink
                key={i}
                to={path}
                className={({ isActive }) =>
                  `relative pb-1 ${isActive ? "text-blue-600" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    {labels[i]}
                    <span
                      className={`absolute left-0 -bottom-0.5 h-0.5 bg-blue-500 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-5">
          <img src={search_icon} alt="search" className="w-5 cursor-pointer" />

          {/* Desktop Profile & Cart */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <img
                src={profil_icon}
                alt="profile"
                className="w-5 cursor-pointer"
              />
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <ul className="flex flex-col text-sm">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Mening profilim
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Buyurtmalar
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
                    Chiqish
                  </li>
                </ul>
              </div>
            </div>
            <Link to="/cart">
              <div className="relative cursor-pointer">
                <img src={cart_icon} alt="cart" className="w-5" />
                <span className="absolute -bottom-1 -right-1 bg-black text-[10px] text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile Profile & Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <img
              src={profil_icon}
              alt="cart"
              className="w-5 sm:w-6 md:w-7 lg:w-8 cursor-pointer"
            />

            <img
              src={cart_icon}
              alt="cart"
              className="w-5 sm:w-6 md:w-7 lg:w-8 cursor-pointer"
            />

            <button className="text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <nav className="flex flex-col items-center gap-4 py-4 font-medium text-slate-700">
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              Bosh sahifa
            </NavLink>
            <NavLink to="/sohalar" onClick={() => setMenuOpen(false)}>
              Kategoriyalar
            </NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>
              Biz haqimizda
            </NavLink>
            <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
              Aloqa
            </NavLink>
          </nav>
        </div>
      )}
    </section>
  );
};

export default React.memo(Navbar);
