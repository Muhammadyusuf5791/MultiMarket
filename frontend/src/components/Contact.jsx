import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiUser, FiMessageSquare, FiSend, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";
import Footer from "./Footer";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [backendAvailable] = useState(false);

  // Mock admin messages
  const mockAdminMessages = [
    { sender: "admin", text: t("contactPage.mock_admin_response", "Hello! We will review your message.") },
    { sender: "admin", text: t("contactPage.mock_admin_response_2", "We will respond soon!") },
  ];

  // Initialize language and messages
  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    const lang = savedLang ? JSON.parse(savedLang).text : "uz";
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }

    // Set initial message
    setMessages([
      {
        sender: "bot",
        text: t("contactPage.enter_name", "Enter your name"),
      },
    ]);

    // Debug
    console.log("Contact initialized:", {
      language: lang,
      translations: {
        title: t("contactPage.title", "Contact Us"),
        enter_name: t("contactPage.enter_name", "Enter your name"),
        enter_email: t("contactPage.enter_email", "Enter your email"),
        enter_message: t("contactPage.enter_message", "Enter your message"),
        message_sent: t("contactPage.message_sent", "Message sent successfully"),
        input_placeholder: t("contactPage.input_placeholder", "Type your message..."),
        send_button: t("contactPage.send_button", "Send"),
        address: t("contactPage.address", "Namangan, Chorsu Market"),
        no_messages: t("contactPage.no_messages", "No messages yet"),
        no_backend: t("contactPage.no_backend", "Backend is not available. Using mock data."),
        mock_admin_response: t("contactPage.mock_admin_response", "Hello! We will review your message."),
        mock_admin_response_2: t("contactPage.mock_admin_response_2", "We will respond soon!"),
      },
      messages,
      step,
    });

    if (!backendAvailable) {
      toast.warn(t("contactPage.no_backend", "Backend is not available. Using mock data."), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-yellow-50 text-yellow-700 font-medium text-sm rounded-lg",
      });
    }
  }, [i18n, t]); // Depend on i18n and t

  // Simulate admin messages
  useEffect(() => {
    if (!backendAvailable && step === 3) {
      const timer = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          ...mockAdminMessages,
        ]);
        console.log("Mock admin messages added:", mockAdminMessages);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, backendAvailable, t]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    console.log("User input:", { input, step, formData });

    if (step === 0) {
      setFormData({ ...formData, name: input });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: t("contactPage.enter_email", "Enter your email") },
      ]);
      setStep(1);
    } else if (step === 1) {
      setFormData({ ...formData, email: input });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: t("contactPage.enter_message", "Enter your message") },
      ]);
      setStep(2);
    } else if (step === 2) {
      setFormData({ ...formData, message: input });
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: t("contactPage.message_sent", "Message sent successfully (mock)"),
        },
      ]);
      toast.success(t("contactPage.message_sent", "Message sent successfully (mock)"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-green-50 text-green-700 font-medium text-sm rounded-lg",
      });
      setStep(3);
    }
    setInput("");
    console.log("After send:", { step, messages, formData });
  };

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        <div className="flex flex-col h-[500px] border rounded-2xl shadow-lg overflow-hidden">
          {!backendAvailable && (
            <div className="p-4 bg-yellow-50 text-yellow-700 text-sm">
              {t("contactPage.no_backend", "Backend is not available. Using mock data.")}
            </div>
          )}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500">
                {t("contactPage.no_messages", "No messages yet")}
              </p>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg max-w-[75%] flex items-center ${
                    msg.sender === "user"
                      ? "ml-auto bg-blue-600 text-white"
                      : msg.sender === "admin"
                      ? "ml-auto bg-green-600 text-white"
                      : "mr-auto bg-gray-300 text-gray-800"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <FiUser className="mr-2" />
                  ) : msg.sender === "admin" ? (
                    <FiUser className="mr-2" />
                  ) : (
                    <FiMessageSquare className="mr-2" />
                  )}
                  {msg.text}
                </div>
              ))
            )}
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
                placeholder={t("contactPage.input_placeholder", "Type your message...")}
                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center"
              >
                <FiSend className="mr-2" />
                {t("contactPage.send_button", "Send")}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{t("contactPage.title", "Contact Us")}</h2>
          <p className="flex items-center">
            <FiMapPin className="mr-2" />
            {t("contactPage.address", "Namangan, Chorsu Market")}
          </p>
          <p className="flex items-center">
            <FiPhone className="mr-2" />
            +998 (90) 690 64 44
          </p>
          <p className="flex items-center">
            <FiMail className="mr-2" />
            multimarket@gmail.com
          </p>

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