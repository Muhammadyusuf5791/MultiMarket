// frontend/src/components/Orders.jsx
import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import {
  FaBoxOpen,
  FaEye,
  FaMoneyBillWave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaCreditCard,
  FaUserTie,
  FaShoppingCart,
  FaFilter,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Orders = () => {
  const { t } = useTranslation();
  const { currentUser } = useContext(Context);
  const [orders, setOrders] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  // Foydalanuvchi buyurtmalarini olish
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!currentUser) {
        setLocalLoading(false);
        return;
      }

      try {
        setLocalLoading(true);
        console.log('Fetching orders for user:', currentUser.uid);
        
        // Barcha buyurtmalarni olish va client-side filter qilish
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        
        const querySnapshot = await getDocs(q);
        const allOrders = [];
        
        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          
          // --- Buyurtma summasini va mahsulotlar sonini hisoblash logikasi ---
          const items = orderData.items || [];
          
          const calculatedOriginalTotal = items.reduce((sum, item) => 
            sum + (item.price || 0) * (item.quantity || 1), 0) || 0;
            
          const discountAmount = orderData.discount || 0;
          
          // Umumiy mahsulot miqdorini hisoblash
          const calculatedTotalQuantity = items.reduce((sum, item) => 
            sum + (item.quantity || 1), 0);
          
          const finalTotal = (orderData.total > 0) 
            ? orderData.total 
            : Math.max(calculatedOriginalTotal - discountAmount, 0); 
          // ------------------------------------------------------------------

          allOrders.push({
            id: doc.id,
            ...orderData,
            createdAt: orderData.createdAt?.toDate?.() || new Date(orderData.createdAt),
            items: items,
            // OriginalTotal ni saqlangan qiymat yoki hisoblangan qiymatga o'rnatish
            originalTotal: orderData.originalTotal || calculatedOriginalTotal, 
            // Total ni saqlangan qiymat yoki hisoblangan qiymatga o'rnatish
            total: finalTotal, 
            discount: discountAmount,
            discountPercentage: orderData.discountPercentage || 0,
            // Mahsulotlar soni
            totalQuantity: orderData.totalQuantity || calculatedTotalQuantity,
            // YANGILANGAN: paymentType qiymati bo'sh bo'lsa, 'cod' ni default qilib o'rnatamiz
            paymentType: orderData.paymentType || 'cod' 
          });
        });

        // Faqat joriy foydalanuvchining buyurtmalarini filter qilish
        const userOrders = allOrders.filter(order => 
          order.userId === currentUser.uid || 
          order.userInfo?.uid === currentUser.uid
        );

        console.log('Total orders:', allOrders.length);
        console.log('User orders:', userOrders.length);
        
        setOrders(userOrders);
        setLocalLoading(false);
        
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Buyurtmalarni yuklashda xatolik: ' + error.message);
        setLocalLoading(false);
      }
    };

    fetchUserOrders();
  }, [currentUser]);

  // Order cancellation timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = {};
      orders.forEach((order) => {
        const createdAt = new Date(order.createdAt).getTime();
        const now = new Date().getTime();
        const secondsElapsed = Math.floor((now - createdAt) / 1000);
        const secondsRemaining = Math.max(120 - secondsElapsed, 0);
        newTimeLeft[order.id] = secondsRemaining;
      });
      setTimeLeft(newTimeLeft);
    }, 1000);
    return () => clearInterval(interval);
  }, [orders]);

  // Bekor qilish funksiyasi - Firebase ga yangilaydi
  const handleCancelOrder = async (orderId) => {
    try {
      // Firebase da statusni yangilash
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      });

      // Local state ni yangilash
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        )
      );
      
      setCancellingOrder(null);
      toast.success(`Buyurtma #${orderId} bekor qilindi!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-green-50 text-green-700 font-medium text-sm rounded-lg",
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.error('Bekor qilishda xatolik!', {
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

  // Yuklanayotganda
  if (localLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Buyurtmalar yuklanmoqda...</h2>
          <p className="text-sm text-gray-500 mt-2">Iltimos kuting</p>
        </div>
      </div>
    );
  }

  // Foydalanuvchi kirmagan bo'lsa
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <FaUser className="text-5xl sm:text-6xl text-gray-300" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
            Tizimga kiring
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Buyurtmalaringizni ko'rish uchun tizimga kiring
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  // Buyurtmalar bo'sh bo'lsa
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <FaBoxOpen className="text-5xl sm:text-6xl text-gray-300" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
            Hozircha buyurtmalar yo'q
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Siz hali hech qanday buyurtma bermagansiz
          </p>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Mahsulotlar sahifasiga o'tish
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
            >
              Yangilash
            </button>
          </div>
          
          {/* Debug ma'lumotlari */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-left">
            <h3 className="font-semibold text-yellow-800 flex items-center mb-2">
              <FaExclamationTriangle className="mr-2" />
              Debug Ma'lumotlari
            </h3>
            <p className="text-sm text-yellow-700">
              <strong>User ID:</strong> {currentUser.uid}
            </p>
            <p className="text-sm text-yellow-700">
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              Agar buyurtma borgan bo'lsa lekin ko'rinmasa, iltimos yangilash tugmasini bosing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Format functions
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("uz-UZ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // To'lov usulini formatlash (YANGILANDI)
  const getPaymentLabel = (type, status) => {
    const lowerCaseType = type?.toLowerCase();

    switch (lowerCaseType) {
      case "click": 
        return "Click orqali to'lov";
      case "payme": 
        return "Payme orqali to'lov";
      case "uzum": 
        return "Uzum Bank orqali to'lov";
      case "delivery": 
        return status === "cash" ? "Yetkazib berishda naqd to'lov" : "Haydovchi orqali to'lov";
      case "cod": 
        return "Yetkazib berishda to'lov (Naqd/Karta)";
      default: 
        // Agar paymentType bo'sh kelsa, lekin deliveryType mavjud bo'lsa, uni ishlatamiz.
        return type || 'Noma\'lum to\'lov usuli'; 
    }
  };

  const getPaymentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "click": return <span className="text-blue-500">🔵</span>;
      case "payme": return <span className="text-green-500">🟢</span>;
      case "uzum": return <span className="text-purple-500">🟣</span>;
      case "delivery": 
      case "cod": 
        return <FaMoneyBillWave className="text-green-600" />;
      default: return <span>💳</span>;
    }
  };

  const getStatusLabel = (order) => {
    if (
      ["payme", "click", "uzum"].includes(order.paymentType?.toLowerCase()) &&
      order.paymentStatus !== "paid"
    ) {
      return (
        <span className="flex items-center text-xs px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-full">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-1 sm:mr-2"></span>
          To'lov kutilmoqda
        </span>
      );
    }
    switch (order.status) {
      case "cancelled":
        return (
          <span className="flex items-center text-xs px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-1 sm:mr-2"></span>
            Bekor qilingan
          </span>
        );
      case "driver_assigned":
        return (
          <span className="flex items-center text-xs px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1 sm:mr-2"></span>
            Haydovchi tayinlangan
          </span>
        );
      case "delivered":
        return (
          <span className="flex items-center text-xs px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></span>
            Yetkazib berilgan
          </span>
        );
      default:
        return (
          <span className="flex items-center text-xs px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-1 sm:mr-2"></span>
            Jarayonda
          </span>
        );
    }
  };

  const filteredOrders = filterStatus === "all"
    ? orders
    : filterStatus === "cancelled"
    ? orders.filter(
        (order) =>
          order.status === "cancelled" ||
          (["payme", "click", "uzum"].includes(order.paymentType?.toLowerCase()) &&
            order.paymentStatus !== "paid")
      )
    : orders.filter(
        (order) =>
          order.status === filterStatus &&
          !(["payme", "click", "uzum"].includes(order.paymentType?.toLowerCase()) &&
            order.paymentStatus !== "paid")
      );

  const canCancelOrder = (order) => {
    const createdAt = new Date(order.createdAt).getTime();
    const now = new Date().getTime();
    const secondsElapsed = Math.floor((now - createdAt) / 1000);
    return secondsElapsed <= 120;
  };

  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
  };

  // UserInfo component
  const UserInfo = ({ order }) => {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
          <FaUser className="mr-2" />
          Mijoz ma'lumotlari
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <FaUser className="text-blue-600 mr-2" />
            <span className="font-medium">{order.userInfo?.fullName || order.fullName || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="text-blue-600 mr-2" />
            <span>{order.userInfo?.email || order.user || 'N/A'}</span>
          </div>
          {(order.userInfo?.phone || order.phone) && (
            <div className="flex items-center">
              <FaPhone className="text-blue-600 mr-2" />
              <span>{order.userInfo?.phone || order.phone}</span>
            </div>
          )}
          <div className="flex items-center">
            <span className="font-medium mr-2">Buyurtma ID:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {order.orderId || order.id}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const CancelModal = ({ order, onClose, onConfirm }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              Buyurtmani bekor qilish
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
            >
              ✕
            </button>
          </div>
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-700">
              <strong>#{order.orderId || order.id}</strong> raqamli buyurtmani bekor qilmoqchimisiz?
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Bu amalni ortga qaytarib bo'lmaydi
            </p>
          </div>
          <div className="flex justify-end gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
            >
              Bekor qilish
            </button>
            <button
              onClick={() => onConfirm(order.id)}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
            >
              Tasdiqlash
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TrackingModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              Buyurtma kuzatish - #{order.orderId || order.id}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Mijoz ma'lumotlari</h4>
            <div className="text-sm space-y-1">
              <div><strong>Ism:</strong> {order.userInfo?.fullName || order.fullName}</div>
              <div><strong>Email:</strong> {order.userInfo?.email || order.user}</div>
              {(order.userInfo?.phone || order.phone) && (
                <div><strong>Telefon:</strong> {order.userInfo?.phone || order.phone}</div>
              )}
              <div><strong>Buyurtma ID:</strong> {order.orderId || order.id}</div>
            </div>
          </div>
          
          <div className="border-t border-b py-3 sm:py-4 my-3 sm:my-4">
            <div className="flex justify-between items-center mb-2 sm:mb-3 text-sm sm:text-base">
              <span className="font-medium">Holati:</span>
              {getStatusLabel(order)}
            </div>
            {order.trackingNumber && (
              <div className="flex justify-between mb-2 sm:mb-3 text-sm sm:text-base">
                <span className="font-medium">Kuzatish raqami:</span>
                <span className="font-semibold">{order.trackingNumber}</span>
              </div>
            )}
            {order.driver && (
              <>
                <div className="flex justify-between mb-2 sm:mb-3 text-sm sm:text-base">
                  <span className="font-medium">Haydovchi:</span>
                  <span className="font-semibold">{order.driver.name}</span>
                </div>
                {order.driver.phone && (
                  <div className="flex justify-between mb-2 sm:mb-3 text-sm sm:text-base">
                    <span className="font-medium">Haydovchi tel:</span>
                    <span className="font-semibold">{order.driver.phone}</span>
                  </div>
                )}
              </>
            )}
            {order.estimatedDelivery && (
              <div className="flex justify-between text-sm sm:text-base">
                <span className="font-medium">Yetkazish vaqti:</span>
                <span className="font-semibold">{order.estimatedDelivery}</span>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <section className="max-w-5xl mx-auto">
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Mening buyurtmalarim
            </h2>
            <p className="text-sm text-gray-600">
              Jami: {orders.length} ta buyurtma
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 py-2 md:py-3">
            {["all", "pending", "driver_assigned", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base font-medium rounded-md whitespace-nowrap transition-all duration-200 ${
                  filterStatus === status
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {status === 'all' && 'Barchasi'}
                {status === 'pending' && 'Jarayonda'}
                {status === 'driver_assigned' && 'Haydovchida'}
                {status === 'delivered' && 'Yetkazilgan'}
                {status === 'cancelled' && 'Bekor qilingan'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden transition-all hover:shadow-xl"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      Buyurtma #{order.orderId || order.id}
                    </h3>
                    {order.orderId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Raqamli ID: {order.orderId}
                      </p>
                    )}
                    <span className="text-xs sm:text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-0">{getStatusLabel(order)}</div>
                </div>
                
                <UserInfo order={order} />
                
                <div className="mb-4">
                  {order.items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="mb-3 pb-3 border-b last:border-b-0"
                    >
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="font-medium text-gray-800">{item.title}</span>
                        <span className="font-semibold">
                          {item.price?.toLocaleString()} so'm
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-1">
                        <span>Miqdor: {item.quantity}</span>
                        <span>
                          Jami: {(item.price * item.quantity).toLocaleString()} so'm
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Chegirma va narxlar bloki */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jami mahsulotlar (dona):</span>
                      <span className="font-medium">
                        {order.totalQuantity} ta
                      </span>
                    </div>
                    
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Chegirma ({order.discountPercentage}%):</span>
                        <span className="font-semibold">
                          -{order.discount?.toLocaleString()} so'm
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Yakuniy summa:</span>
                      <span className="text-blue-600">
                        {order.total?.toLocaleString()} so'm
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-3 border-t">
                  <div className="flex items-center text-sm text-gray-700 mb-2 sm:mb-0">
                    {getPaymentIcon(order.paymentType)}
                    <span className="ml-2">
                      {/* paymentType va paymentStatus ni to'g'ri uzatyapmiz */}
                      {getPaymentLabel(order.paymentType, order.paymentStatus)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      To'lov holati:{" "}
                      <span className={`font-semibold ${
                        order.paymentStatus === "paid" ? "text-green-600" : "text-red-600"
                      }`}>
                        {order.paymentStatus === "paid" ? "To'langan" : "To'lanmagan"}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={() => handleTrackOrder(order)}
                    className="flex items-center text-xs sm:text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition"
                  >
                    <FaEye className="mr-1 sm:mr-2" />
                    Kuzatish
                  </button>
                  
                  {order.paymentStatus !== "paid" &&
                    order.status !== "cancelled" &&
                    order.status !== "delivered" &&
                    canCancelOrder(order) && (
                      <button
                        onClick={() => setCancellingOrder(order)}
                        className="flex items-center text-xs sm:text-sm bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition"
                      >
                        <FaTimes className="mr-1 sm:mr-2" />
                        Bekor qilish ({formatTimeLeft(timeLeft[order.id] || 0)})
                      </button>
                    )}
                  
                  {order.paymentStatus !== "paid" &&
                    order.status !== "cancelled" &&
                    order.status !== "delivered" &&
                    !canCancelOrder(order) && (
                      <span className="text-xs sm:text-sm text-gray-500">
                        Bekor qilish muddati o'tgan
                      </span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {cancellingOrder && (
          <CancelModal
            order={cancellingOrder}
            onClose={() => setCancellingOrder(null)}
            onConfirm={handleCancelOrder}
          />
        )}
        
        {trackingOrder && (
          <TrackingModal
            order={trackingOrder}
            onClose={() => setTrackingOrder(null)}
          />
        )}
      </section>
    </div>
  );
};

export default React.memo(Orders);