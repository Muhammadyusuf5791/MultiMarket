import React, { useState, useEffect, useRef } from "react";
import { FiUser, FiMessageSquare, FiSend, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase'; // Auth ni import qilish kerak
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'; // Auth funksiyalarini import qilish kerak
import Footer from './Footer'


const Contact = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  // Avtorizatsiyadan olingan haqiqiy UID ni saqlaymiz
  const [currentAuthUserId, setCurrentAuthUserId] = useState(null); 
  const [conversationId, setConversationId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Scrollni pastga tushirish
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // 1. Foydalanuvchi ID sini aniqlash (ASOSIY O'ZGARTIRILGAN QISM)
  useEffect(() => {
    const initializeUserAndChat = async (user) => {
        const userId = user.uid;
        setCurrentAuthUserId(userId);
        
        // Foydalanuvchi nomini o'rnatish (email yoki anonim/mehmon)
        const userName = user.email || user.isAnonymous 
            ? `Mehmon_${userId.slice(-6)}` 
            : `Foydalanuvchi_${userId.slice(-6)}`;

        await initializeConversation(userId, userName);
        setIsLoading(false);
    }
    
    // Foydalanuvchi holati o'zgarishini kuzatish
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
            // 1. Agar foydalanuvchi login qilgan bo'lsa (yoki anonim)
            await initializeUserAndChat(user);
        } else {
            // 2. Agar foydalanuvchi logindan chiqqan bo'lsa, uni anonim tarzda kiritamiz
            try {
                const credential = await signInAnonymously(auth);
                await initializeUserAndChat(credential.user);
            } catch (error) {
                console.error("Anonim kirishda xato:", error);
                // Agar anonim kirishda xato bo'lsa, chatni bloklash
                setCurrentAuthUserId(null);
                setConversationId("");
                setIsLoading(false);
                toast.error("Avtorizatsiyada xato, chat ishlamaydi.");
            }
        }
    });

    return () => unsubscribeAuth();
  }, []); // Faqat bir marta yuklanadi

  // Konversatsiyani yaratish yoki mavjudini topish
  const initializeConversation = async (user, userName) => {
    try {
      // 'userId' ni hozirgi (login qilgan/anonim) foydalanuvchining ID siga tenglashtiramiz
      const q = query(
        collection(db, 'conversations'),
        where('userId', '==', user), // Har bir UID uchun alohida chat!
        where('type', '==', 'contact')
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Yangi konversatsiya yaratish
        const docRef = await addDoc(collection(db, 'conversations'), {
          userId: user,
          userName: userName, // Yangi nomni ishlatamiz
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastMessage: "Assalomu alaykum!",
          type: 'contact',
          hasUnread: false,
        });
        setConversationId(docRef.id);

        await addDoc(collection(db, 'messages'), {
          conversationId: docRef.id,
          sender: 'admin',
          text: "Assalomu alaykum! Savolingiz bo'lsa, yozing. Tez orada javob beramiz.",
          timestamp: serverTimestamp(),
          read: true
        });
      } else {
        const conversation = snapshot.docs[0];
        setConversationId(conversation.id);
      }
    } catch (error) {
      console.error('Konversatsiya yaratishda xato:', error);
      toast.error("Chatni ishga tushirishda xato");
    }
  };
  
  // 2. Messagelarni real vaqtda kuzatish
  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
      markAdminMessagesAsRead(messagesData);
    }, (error) => {
        console.error("Xabarlarni kuzatishda xato:", error);
    });

    return () => unsubscribe();
  }, [conversationId]);
  
  
  const markAdminMessagesAsRead = async (messagesData) => {
    // Agar foydalanuvchi hali to'liq avtorizatsiyadan o'tmagan bo'lsa, davom etmaymiz
    if (!currentAuthUserId) return;
    
    const unreadAdminMessages = messagesData.filter(
      (msg) => (msg.sender === 'admin' || msg.sender === 'bot') && !msg.read
    );

    if (unreadAdminMessages.length > 0) {
      const updates = unreadAdminMessages.map(msg => 
          updateDoc(doc(db, 'messages', msg.id), { read: true })
      );
      // Xatolarni e'tiborsiz qoldirish uchun Promise.all dan foydalanamiz
      await Promise.all(updates).catch(e => console.error("Xabarlarni o'qilgan deb belgilashda xato:", e));
      
      await updateDoc(doc(db, 'conversations', conversationId), {
          hasUnread: false
      }).catch(e => console.error("Konversatsiya unread statusini yangilashda xato:", e));
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;

    try {
      const messageText = input.trim();

      await addDoc(collection(db, 'messages'), {
        conversationId: conversationId,
        sender: 'user', // foydalanuvchi xabari
        text: messageText,
        timestamp: serverTimestamp(),
        read: false,
      });

      await updateDoc(doc(db, 'conversations', conversationId), {
        updatedAt: serverTimestamp(),
        lastMessage: messageText,
        status: 'active',
        hasUnread: true
      });

      setInput("");

    } catch (error) {
      console.error('Xabar yuborishda xato:', error);
      toast.error("Xabar yuborishda xato");
    }
  };
  
  // Xabarlarni formatlash
  const formatMessage = (msg) => {
    const isUser = msg.sender === "user";
    const bgColor = isUser ? "bg-blue-600 text-white" : "bg-white border text-gray-800"; 
    const alignment = isUser ? "ml-auto" : "mr-auto";
    const timeColor = isUser ? "text-blue-200" : "text-gray-600";
    const iconBg = isUser ? "bg-blue-500" : "bg-gray-200";

    return (
      <div
        key={msg.id}
        className={`p-3 rounded-xl max-w-[75%] flex items-start ${alignment} ${bgColor} ${isUser ? "flex-row-reverse" : ""}`}
      >
        <div className={`p-2 rounded-full ${iconBg} flex-shrink-0`}>
          {isUser ? (
            <FiUser className="text-white" />
          ) : (
            <FiMessageSquare className="text-gray-600" /> 
          )}
        </div>
        <div className={`mx-2 ${isUser ? "text-right" : "text-left"}`}>
          <p className="break-words">{msg.text}</p>
          <span className={`text-xs mt-1 block ${timeColor}`}>
            {msg.timestamp?.toDate()?.toLocaleTimeString() || 'Hozir'}
          </span>
        </div>
      </div>
    );
  };
  

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        {/* Chat qismi */}
        <div className="flex flex-col h-[500px] border rounded-2xl shadow-lg overflow-hidden">
          {/* ... (Chat sarlavhasi) */}
          <div className="p-4 bg-blue-600 text-white">
            <h3 className="font-bold">Online Yordam</h3>
            <p className="text-sm text-blue-100">
              Savollaringizga tez javob oling
            </p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : !currentAuthUserId ? (
                 <div className="text-center text-red-500 py-8">
                     <FiUser className="mx-auto text-4xl mb-2" />
                     <p>Chatni ishga tushirish uchun avtorizatsiya talab qilinadi.</p>
                 </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <FiMessageSquare className="mx-auto text-4xl mb-2" />
                <p>Hozircha xabarlar yo'q</p>
              </div>
            ) : (
              messages.map((msg) => formatMessage(msg))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center border-t p-3 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Xabaringizni yozing..."
              className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={isLoading || !conversationId || !currentAuthUserId} 
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || !conversationId || !currentAuthUserId}
              className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSend className="mr-2" />
              Yuborish
            </button>
          </form>
        </div>

        {/* Kontakt ma'lumotlari (o'zgarishsiz) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Biz bilan bog'laning</h2>
          <div className="space-y-4">
            <p className="flex items-center text-gray-700">
              <FiMapPin className="mr-3 text-blue-600" />
              <span>Namangan, Chorsu Bozori</span>
            </p>
            <p className="flex items-center text-gray-700">
              <FiPhone className="mr-3 text-blue-600" />
              <span>+998 (90) 690 64 44</span>
            </p>
            <p className="flex items-center text-gray-700">
              <FiMail className="mr-3 text-blue-600" />
              <span>multimarket@gmail.com</span>
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Ish vaqtlari
            </h3>
            <p className="text-blue-700">
              Dushanba - Shanba: 9:00 - 18:00
            </p>
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.7959311078893!2d71.672027!3d41.000315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bcbbd5ad2b6c25%3A0x5b7b7f78f6b8ddc6!2sChorsu%20Bozori!5e0!3m2!1suz!2s!4v1704450000000"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-2xl shadow-lg w-full"
            title="Chorsu Bozori lokatsiyasi"
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
