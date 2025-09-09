import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Kategoriyalar from "./components/Kategoriyalar";
import Contact from "./components/Contact";
import CartTotal from "./pages/CartTotal"; // 🆕 qo‘shildi
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sohalar" element={<Kategoriyalar />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<CartTotal />} /> {/* 🆕 Savat sahifasi */}
      </Routes>
    </div>
  );
};

export default App;
