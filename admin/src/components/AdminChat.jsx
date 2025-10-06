import React, { useState, useEffect, useRef } from "react";
import { FiUser, FiMessageSquare, FiSend, FiSearch } from "react-icons/fi";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase'; // db obyektingizni tekshiring

const AdminChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const messagesEndRef = useRef(null);

  // Barcha konversatsiyalarni real vaqtda kuzatish va o'qilmagan xabarlarni hisoblash
  useEffect(() => {
    const q = query(
      collection(db, 'conversations'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      let conversationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Har bir konversatsiya uchun o'qilmagan xabarlar sonini hisoblash
      for (let conv of conversationsData) {
        // Faqat foydalanuvchidan kelgan va admin tomonidan o'qilmagan xabarlar
        const unreadQ = query(
          collection(db, 'messages'),
          where('conversationId', '==', conv.id),
          where('sender', '==', 'user'),
          where('read', '==', false)
        );
        const unreadSnapshot = await getDocs(unreadQ);
        conv.unreadCount = unreadSnapshot.docs.length;
      }
      
      setConversations(conversationsData);
    });

    return () => unsubscribe();
  }, []);

  // Tanlangan konversatsiya xabarlarini olish va o'qilgan deb belgilash
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    // Xabarlarni olish
    const messagesQuery = query(
      collection(db, 'messages'),
      where('conversationId', '==', selectedConversation.id),
      orderBy('timestamp', 'asc')
    );

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);

      // Admin tomonidan ko'rilgan barcha foydalanuvchi xabarlarini o'qilgan qilish
      // Bunda `selectedConversation` obyekti mavjudligiga ishonch hosil qilishimiz kerak.
      if (selectedConversation.id) {
          markMessagesAsRead(messagesData, selectedConversation.id);
      }
    });

    return () => unsubscribeMessages();
  }, [selectedConversation]);

  // Scrollni pastga olib chiqish
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Xabarlarni o'qilgan deb belgilash
  const markMessagesAsRead = async (messagesData, convId) => {
    // Faqat admin uchun o'qilmagan foydalanuvchi xabarlarini filtrlash
    const unreadMessages = messagesData.filter(
      (msg) => msg.sender === 'user' && !msg.read
    );

    // Barcha o'qilmagan xabarlarning `read` maydonini `true` qilish
    if (unreadMessages.length > 0) {
        // Barcha yangilash operatsiyalarini Promise.all bilan optimallashtiramiz
        const updates = unreadMessages.map(msg => 
            updateDoc(doc(db, 'messages', msg.id), { read: true })
        );
        await Promise.all(updates);
    }
    
    // Konversatsiyadagi umumiy o'qilmaganlik holatini yangilash (agar mavjud bo'lsa)
    if (unreadMessages.length > 0) {
        await updateDoc(doc(db, 'conversations', convId), {
            hasUnread: false // Admin ko'rdi
        });
    }
  };

  // Admin xabar yuborish
  const sendAdminMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messageText = newMessage.trim();

      // 1. Yangi xabar qo'shish
      await addDoc(collection(db, 'messages'), {
        conversationId: selectedConversation.id,
        sender: 'admin',
        text: messageText,
        timestamp: serverTimestamp(),
        read: true, // Admin o'zi yuborgani uchun o'qilgan
      });

      // 2. Konversatsiyani yangilash
      await updateDoc(doc(db, 'conversations', selectedConversation.id), {
        updatedAt: serverTimestamp(),
        lastMessage: messageText,
        status: 'active',
        // Admin javob bergani uchun o'qilmaganlik holatini o'chirish
        hasUnread: false, 
      });

      setNewMessage("");
    } catch (error) {
      console.error('Xabar yuborishda xato:', error);
    }
  };

  // Konversatsiya statusini o'zgartirish
  const updateConversationStatus = async (conversationId, status) => {
    try {
      await updateDoc(doc(db, 'conversations', conversationId), {
        status: status,
        updatedAt: serverTimestamp(),
      });
      // Agar yechilgan bo'lsa, tanlovni tozalash
      if (status === 'resolved') {
        setSelectedConversation(null); 
      }
    } catch (error) {
      console.error('Statusni yangilashda xato:', error);
    }
  };

  // Filtrlangan konversatsiyalar
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || conv.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Konversatsiyalar paneli */}
      <div className="w-1/3 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-4">Konversatsiyalar</h2>
          
          {/* Qidiruv va filter */}
          <div className="space-y-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">Hammasi</option>
              <option value="active">Faol</option>
              <option value="resolved">Yechilgan</option>
            </select>
          </div>
        </div>

        {/* Konversatsiyalar ro'yxati */}
        <div className="overflow-y-auto flex-1">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              } ${conversation.unreadCount > 0 ? 'border-l-4 border-red-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <FiUser className="text-gray-400 mr-2" />
                  <span className="font-semibold">{conversation.userName}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  conversation.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {conversation.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 truncate mb-1">
                {conversation.lastMessage || "Xabar yo'q"}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>
                  {conversation.updatedAt?.toDate().toLocaleString()}
                </span>
                {/* O'qilmagan xabarlar soni */}
                {conversation.unreadCount > 0 && (
                  <span className="bg-red-500 text-white rounded-full px-2 py-1 min-w-[24px] text-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat oynasi */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="bg-white border-b p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{selectedConversation.userName}</h3>
                  <p className="text-sm text-gray-600">{selectedConversation.userId}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateConversationStatus(selectedConversation.id, 'resolved')}
                    disabled={selectedConversation.status === 'resolved'}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300"
                  >
                    Yechish
                  </button>
                  <button
                    onClick={() => updateConversationStatus(selectedConversation.id, 'active')}
                    disabled={selectedConversation.status === 'active'}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                  >
                    Qayta ochish
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl max-w-[75%] flex items-start ${
                    msg.sender === "admin"
                      ? "ml-auto bg-blue-600 text-white flex-row-reverse"
                      : "mr-auto bg-white border text-gray-800"
                  }`}
                >
                  <div className={`p-2 rounded-full ${msg.sender === "admin" ? "bg-blue-500" : "bg-gray-200"} flex-shrink-0`}>
                    {msg.sender === "admin" ? (
                      <FiUser className="text-white" />
                    ) : (
                      <FiMessageSquare className="text-gray-600" />
                    )}
                  </div>
                  <div className={`mx-2 ${msg.sender === "admin" ? "text-right" : "text-left"}`}>
                    <p className="break-words">{msg.text}</p>
                    <span className={`text-xs mt-1 block ${
                      msg.sender === "admin" ? "text-blue-200" : "text-gray-600"
                    }`}>
                      {msg.timestamp?.toDate().toLocaleString()}
                      {msg.sender === "user" && !msg.read && " • O'qilmagan"}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendAdminMessage} className="bg-white border-t p-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Xabaringizni yozing..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || selectedConversation.status === 'resolved'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="mr-2" />
                  Yuborish
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FiMessageSquare className="mx-auto text-4xl mb-2" />
              <p>Konversatsiyani tanlang</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;