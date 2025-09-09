import React, { useState, useEffect } from "react";
import Footer from "./Footer";

const Contact = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Salom! Biz bilan bog'lanish uchun ismingizni yozing.",
    },
  ]);
  const [input, setInput] = useState("");

  // 🔹 Admin yozgan xabarlarni olish (polling)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/contact/messages");
        const data = await res.json();
        setMessages((prev) => [
          ...prev.filter((m) => m.sender !== "admin"),
          ...data,
        ]);
      } catch (err) {
        console.error("Admin xabarlarini olishda xatolik:", err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);

    if (step === 0) {
      setFormData({ ...formData, name: input });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "✅ Rahmat! Endi emailingizni kiriting." },
      ]);
      setStep(1);
    } else if (step === 1) {
      setFormData({ ...formData, email: input });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "✍️ Yaxshi! Endi xabaringizni yozing." },
      ]);
      setStep(2);
    } else if (step === 2) {
      const updatedData = { ...formData, message: input };
      setFormData(updatedData);

      try {
        await fetch("http://localhost:5000/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "📨 Xabaringiz yuborildi! Admin tez orada javob beradi.",
          },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "❌ Xatolik yuz berdi." },
        ]);
      }
      setStep(3);
    }

    setInput("");
  };

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        {/* Chap taraf - Chat */}
        <div className="flex flex-col h-[500px] border rounded-2xl shadow-lg overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[75%] ${
                  msg.sender === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : msg.sender === "admin"
                    ? "ml-auto bg-green-600 text-white"
                    : "mr-auto bg-gray-300 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {step < 3 && (
            <form
              onSubmit={handleSend}
              className="flex items-center border-t p-3 bg-white"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Javobingizni yozing..."
                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Yuborish
              </button>
            </form>
          )}
        </div>

        {/* O‘ng taraf - Aloqa ma’lumotlari */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Bizning aloqa ma'lumotlar</h2>
          <p>📍 Dokonimiz: Namangan shahri, Chorsu bozori</p>
          <p>📞 +998 (90) 690 64 44</p>
          <p>📧 multimarket@gmail.com</p>

          {/* Google Maps - Chorsu */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.7959311078893!2d71.672027!3d41.000315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bcbbd5ad2b6c25%3A0x5b7b7f78f6b8ddc6!2sChorsu%20Bozori!5e0!3m2!1suz!2s!4v1704450000000"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-2xl shadow-lg w-full md:w-4/5"
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default React.memo(Contact);
