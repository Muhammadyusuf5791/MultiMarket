// admin/src/components/AdminOrders.jsx
import React, { useContext, useState, useEffect } from "react";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import {
  FaBoxOpen,
  FaEye,
  FaMoneyBillWave,
  FaTimes,
  FaCheck,
  FaTruck,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendar,
  FaCreditCard,
  FaUserTie,
  FaShoppingCart,
  FaFilter,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaIdCard
} from "react-icons/fa";

const AdminOrders = () => {
  const { 
    orders = [], 
    loading, 
    updateOrderStatus, 
    assignDriverToOrder,
    cancelOrder,
    completeOrder,
    fetchOrdersFromFirebase
  } = useContext(AdminContext);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionOrder, setActionOrder] = useState(null);
  const [driverModal, setDriverModal] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [driverInfo, setDriverInfo] = useState({
    name: "",
    phone: "",
    carNumber: ""
  });

  // Sana formatlash funksiyasi - Timestamp ni to'g'ri ishlovchi
  const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    
    let date;
    
    // Agar dateValue Timestamp bo'lsa
    if (dateValue && typeof dateValue === 'object' && dateValue.toDate) {
      date = dateValue.toDate();
    }
    // Agar dateValue string bo'lsa
    else if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    }
    // Agar dateValue Date object bo'lsa
    else if (dateValue instanceof Date) {
      date = dateValue;
    }
    // Agar dateValue number (timestamp) bo'lsa
    else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    }
    else {
      return '-';
    }
    
    // Sana noto'g'ri bo'lsa
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    return date.toLocaleString("uz-UZ", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Qisqa sana format
  const formatShortDate = (dateValue) => {
    if (!dateValue) return '-';
    
    let date;
    
    if (dateValue && typeof dateValue === 'object' && dateValue.toDate) {
      date = dateValue.toDate();
    } else if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else {
      return '-';
    }
    
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    return date.toLocaleString("uz-UZ", {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sana bo'yicha tartiblash uchun funksiya
  const getDateForSorting = (order) => {
    const dateValue = order.createdAt;
    
    if (!dateValue) return new Date(0);
    
    if (dateValue && typeof dateValue === 'object' && dateValue.toDate) {
      return dateValue.toDate();
    }
    if (typeof dateValue === 'string') {
      return new Date(dateValue);
    }
    if (dateValue instanceof Date) {
      return dateValue;
    }
    if (typeof dateValue === 'number') {
      return new Date(dateValue);
    }
    
    return new Date(0);
  };

  // Real-time yangilash
  useEffect(() => {
    fetchOrdersFromFirebase();
  }, []);

  // Statistika
  const stats = {
    total: orders.length,
    pending: orders.filter(order => order.status === 'pending').length,
    driver_assigned: orders.filter(order => order.status === 'driver_assigned').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length,
    today: orders.filter(order => {
      try {
        const orderDate = getDateForSorting(order);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      } catch (error) {
        return false;
      }
    }).length
  };

  // Yuklanayotganda
  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Buyurtmalar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Buyurtmalar bo'sh bo'lsa
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <FaBoxOpen className="text-5xl sm:text-6xl text-gray-300" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
            Hozircha buyurtmalar yo'q
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Mijozlar buyurtma berishni boshlagandan so'ng buyurtmalar shu yerda ko'rinadi
          </p>
        </div>
      </div>
    );
  }

  // To'lov usulini formatlash - YANGILANDI
  const getPaymentLabel = (type, status) => {
    switch (type?.toLowerCase()) {
      case "click": 
        return "Click orqali to'lov";
      case "payme": 
        return "Payme orqali to'lov";
      case "uzum": 
        return "Uzum Bank orqali to'lov";
      case "delivery": 
        return status === "cash" ? "Yetkazib berishda naqd to'lov" : "Haydovchi orqali to'lov";
      case "cod": 
        return "Yetkazib berishda to'lov";
      default: 
        return type || 'Noma\'lum to\'lov usuli';
    }
  };

  // To'lov ikonkasi
  const getPaymentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "click": return <span className="text-blue-500">🔵</span>;
      case "payme": return <span className="text-green-500">🟢</span>;
      case "uzum": return <span className="text-purple-500">🟣</span>;
      case "delivery": return <FaMoneyBillWave className="text-green-600" />;
      default: return <span>💳</span>;
    }
  };

  // Status label
  const getStatusLabel = (order) => {
    if (order.status === "cancelled") {
      return (
        <span className="flex items-center text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Bekor qilingan
        </span>
      );
    }
    
    if (["payme", "click", "uzum"].includes(order.paymentType?.toLowerCase()) && order.paymentStatus !== "paid") {
      return (
        <span className="flex items-center text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
          To'lov kutilmoqda
        </span>
      );
    }

    switch (order.status) {
      case "driver_assigned":
        return (
          <span className="flex items-center text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Haydovchi tayinlangan
          </span>
        );
      case "delivered":
        return (
          <span className="flex items-center text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Yetkazib berilgan
          </span>
        );
      default:
        return (
          <span className="flex items-center text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Jarayonda
          </span>
        );
    }
  };

  // Qidiruv va filtr
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.orderId?.toString().includes(searchTerm) ||
      order.userInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userInfo?.phone?.includes(searchTerm) ||
      order.userInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Tartiblash - sana bo'yicha
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => getDateForSorting(b) - getDateForSorting(a)
  );

  // Status yangilash
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setActionOrder(null);
      toast.success(`Buyurtma statusi yangilandi!`);
    } catch (error) {
      toast.error('Status yangilashda xatolik: ' + error.message);
    }
  };

  // Haydovchi tayinlash
  const handleAssignDriver = async (orderId) => {
    try {
      if (!driverInfo.name || !driverInfo.phone) {
        toast.error('Haydovchi ismi va telefoni kiritilishi shart');
        return;
      }

      await assignDriverToOrder(orderId, {
        ...driverInfo,
        assignedAt: new Date().toISOString()
      });
      
      setDriverModal(null);
      setDriverInfo({ name: "", phone: "", carNumber: "" });
      toast.success('Haydovchi muvaffaqiyatli tayinlandi!');
    } catch (error) {
      toast.error('Haydovchi tayinlashda xatolik: ' + error.message);
    }
  };

  // Buyurtmani bekor qilish
  const handleCancelOrder = async (orderId, reason) => {
    try {
      await cancelOrder(orderId, reason);
      setCancelModal(null);
      toast.success('Buyurtma muvaffaqiyatli bekor qilindi!');
    } catch (error) {
      toast.error('Buyurtmani bekor qilishda xatolik: ' + error.message);
    }
  };

  // Buyurtmani yakunlash
  const handleCompleteOrder = async (orderId) => {
    try {
      await completeOrder(orderId);
      toast.success('Buyurtma yetkazib berildi deb belgilandi!');
    } catch (error) {
      toast.error('Buyurtmani yakunlashda xatolik: ' + error.message);
    }
  };

  // Modal Components

  // Status Action Modal
  const StatusActionModal = ({ order, onClose, onUpdate }) => {
    const getAvailableActions = (currentStatus) => {
      const actions = [];
      
      if (currentStatus === 'pending') {
        actions.push(
          { 
            value: 'driver_assigned', 
            label: 'Haydovchi tayinlash', 
            icon: <FaUserTie className="text-blue-600" />,
            color: 'blue',
            description: 'Buyurtma haydovchiga yuklanadi'
          }
        );
      }
      
      if (currentStatus === 'driver_assigned') {
        actions.push(
          { 
            value: 'delivered', 
            label: 'Yetkazib berildi', 
            icon: <FaCheck className="text-green-600" />,
            color: 'green',
            description: 'Buyurtma mijozga yetkazildi'
          }
        );
      }
      
      if (currentStatus !== 'cancelled' && currentStatus !== 'delivered') {
        actions.push(
          { 
            value: 'cancelled', 
            label: 'Bekor qilish', 
            icon: <FaTimes className="text-red-600" />,
            color: 'red',
            description: 'Buyurtma bekor qilinadi'
          }
        );
      }

      return actions;
    };

    const availableActions = getAvailableActions(order?.status);

    const handleAction = (action) => {
      if (action.value === 'driver_assigned') {
        setDriverModal(order);
      } else if (action.value === 'cancelled') {
        setCancelModal(order);
      } else {
        onUpdate(order.id, action.value);
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Buyurtma #{order?.orderId || order?.id} - Amallar
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
              ✕
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Joriy holat: <strong>{getStatusLabel(order)}</strong>
            </p>
          </div>
          
          <div className="space-y-3">
            {availableActions.map((action) => (
              <button
                key={action.value}
                onClick={() => handleAction(action)}
                className={`w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left ${
                  action.color === 'red' ? 'hover:bg-red-50' : 
                  action.color === 'green' ? 'hover:bg-green-50' : 'hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {action.icon}
                  <div>
                    <span className="font-medium block">{action.label}</span>
                    <span className="text-xs text-gray-500">{action.description}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Driver Assignment Modal
  const DriverAssignmentModal = ({ order, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Haydovchi tayinlash - #{order?.orderId || order?.id}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
              ✕
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              Mijoz: <strong>{order.userInfo?.fullName || order.fullName}</strong> | {order.userInfo?.phone || order.phone}
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Haydovchi ismi *
              </label>
              <input
                type="text"
                value={driverInfo.name}
                onChange={(e) => setDriverInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Haydovchi ismini kiriting"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon raqami *
              </label>
              <input
                type="tel"
                value={driverInfo.phone}
                onChange={(e) => setDriverInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+998 90 123 45 67"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mashina raqami
              </label>
              <input
                type="text"
                value={driverInfo.carNumber}
                onChange={(e) => setDriverInfo(prev => ({ ...prev, carNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="01 A 123 AA"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Bekor qilish
            </button>
            <button
              onClick={() => handleAssignDriver(order.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <FaUserTie className="mr-2" />
              Tayinlash
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Cancel Order Modal
  const CancelOrderModal = ({ order, onClose }) => {
    const [reason, setReason] = useState('');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-red-600">
              Buyurtmani bekor qilish - #{order?.orderId || order?.id}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
              ✕
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700">
              Diqqat! Bu amalni ortga qaytarib bo'lmaydi.
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bekor qilish sababi *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Bekor qilish sababini batafsil yozing..."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Bekor qilish
            </button>
            <button
              onClick={() => handleCancelOrder(order.id, reason)}
              disabled={!reason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-red-300 disabled:cursor-not-allowed flex items-center"
            >
              <FaTimes className="mr-2" />
              Tasdiqlash
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Order Detail Modal
  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-6xl p-6 max-h-[95vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold">
                Buyurtma tafsilotlari - #{order.orderId || order.id}
              </h3>
              {order.orderId && (
                <p className="text-sm text-gray-500 mt-1">
                  Raqamli ID: {order.orderId}
                </p>
              )}
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
              ✕
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chap qism - Ma'lumotlar */}
            <div className="space-y-6">
              {/* Mijoz ma'lumotlari */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold mb-4 flex items-center text-gray-800">
                  <FaUser className="mr-2 text-green-600" />
                  Mijoz ma'lumotlari
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <FaIdCard className="text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{order.userInfo?.fullName || order.fullName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Foydalanuvchi ID: {order.userInfo?.uid || order.userId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-400 mr-3" />
                    <p className="font-medium">{order.userInfo?.email || order.user}</p>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="text-gray-400 mr-3" />
                    <p className="font-medium">{order.userInfo?.phone || order.phone}</p>
                  </div>
                  {order.address && (
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-gray-600">Yetkazib berish manzili:</p>
                        <p className="mt-1 text-gray-800">{order.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Buyurtma ma'lumotlari */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold mb-4 flex items-center text-gray-800">
                  <FaCalendar className="mr-2 text-blue-600" />
                  Buyurtma ma'lumotlari
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Buyurtma raqami:</span>
                    <span className="font-medium">#{order.orderId || order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sana:</span>
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Holat:</span>
                    <span>{getStatusLabel(order)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To'lov usuli:</span>
                    <span className="flex items-center">
                      {getPaymentIcon(order.paymentType)}
                      <span className="ml-2">{getPaymentLabel(order.paymentType, order.paymentStatus)}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To'lov holati:</span>
                    <span className={`font-medium ${
                      order.paymentStatus === "paid" ? "text-green-600" : "text-red-600"
                    }`}>
                      {order.paymentStatus === "paid" ? "To'langan" : "To'lanmagan"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Haydovchi ma'lumotlari */}
              {order.driver && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold mb-4 flex items-center text-blue-800">
                    <FaUserTie className="mr-2 text-blue-600" />
                    Haydovchi ma'lumotlari
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ismi:</span>
                      <span className="font-medium">{order.driver.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telefon:</span>
                      <span className="font-medium">{order.driver.phone}</span>
                    </div>
                    {order.driver.carNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mashina raqami:</span>
                        <span className="font-medium">{order.driver.carNumber}</span>
                      </div>
                    )}
                    {order.assignedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tayinlangan vaqt:</span>
                        <span className="font-medium">{formatDate(order.assignedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* O'ng qism - Mahsulotlar va narxlar */}
            <div className="space-y-6">
              {/* Mahsulotlar ro'yxati */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-4 flex items-center text-gray-800">
                  <FaShoppingCart className="mr-2 text-purple-600" />
                  Buyurtma mahsulotlari
                </h4>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={item.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-12 h-12 object-cover rounded mr-3"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-600">
                            Miqdor: {item.quantity} x {item.price?.toLocaleString()} so'm
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {(item.price * item.quantity).toLocaleString()} so'm
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Narxlar - YANGILANDI */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-4 flex items-center text-gray-800">
                  <FaCreditCard className="mr-2 text-green-600" />
                  To'lov ma'lumotlari
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600">Jami mahsulotlar:</span>
                    <span className="font-medium">
                      {order.originalTotal?.toLocaleString()} so'm
                    </span>
                  </div>
                  
                  {order.discount > 0 && (
                    <div className="flex justify-between items-center py-1 text-green-600">
                      <span>Chegirma ({order.discountPercentage}%):</span>
                      <span className="font-semibold">
                        -{order.discount?.toLocaleString()} so'm
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-2 pt-2">
                    <span className="text-lg font-bold text-gray-800">Yakuniy summa:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {order.total?.toLocaleString()} so'm
                    </span>
                  </div>
                </div>
              </div>

              {/* Qo'shimcha izoh */}
              {order.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-yellow-800">
                    Qo'shimcha izoh
                  </h4>
                  <p className="text-sm text-yellow-700">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Yopish
            </button>
            {order.status !== "cancelled" && order.status !== "delivered" && (
              <button
                onClick={() => setActionOrder(order)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <FaEdit className="mr-2" />
                Holatni o'zgartirish
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <section className="max-w-7xl mx-auto">
        {/* Sarlavha va statistikalar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Buyurtmalar Boshqaruvi</h2>
              <p className="text-gray-600">Barcha buyurtmalarni ko'rish va boshqarish</p>
            </div>
            <button
              onClick={fetchOrdersFromFirebase}
              className="mt-4 lg:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <FaSearch className="mr-2" />
              Yangilash
            </button>
          </div>
          
          {/* Statistikalar */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Jami</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <FaShoppingCart className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bugun</p>
                  <p className="text-2xl font-bold text-green-600">{stats.today}</p>
                </div>
                <FaCalendar className="text-green-600 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Jarayonda</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <FaTruck className="text-yellow-600 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Haydovchida</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.driver_assigned}</p>
                </div>
                <FaUserTie className="text-orange-600 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Yetkazilgan</p>
                  <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <FaCheck className="text-green-600 text-xl" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bekor</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <FaTimes className="text-red-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Qidiruv va Filterlar */}
          <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Qidiruv */}
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buyurtma ID, ism, telefon yoki email bo'yicha qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filterlar */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "Barchasi", color: "gray" },
                  { value: "pending", label: "Jarayonda", color: "yellow" },
                  { value: "driver_assigned", label: "Haydovchida", color: "orange" },
                  { value: "delivered", label: "Yetkazilgan", color: "green" },
                  { value: "cancelled", label: "Bekor", color: "red" }
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setFilterStatus(status.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      filterStatus === status.value
                        ? `bg-${status.color}-600 text-white shadow-md`
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buyurtmalar jadvali - YANGILANDI */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyurtma
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mijoz
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To'lov usuli
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Narxlar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Holat
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sana
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderId || order.id}
                      </div>
                      {order.orderId && (
                        <div className="text-xs text-gray-500">
                          ID: {order.orderId}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {order.userInfo?.fullName || order.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.userInfo?.phone || order.phone}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        {getPaymentIcon(order.paymentType)}
                        <span className="ml-2">
                          {getPaymentLabel(order.paymentType, order.paymentStatus)}
                        </span>
                      </div>
                      <div className={`text-xs mt-1 ${
                        order.paymentStatus === "paid" ? "text-green-600" : "text-red-600"
                      }`}>
                        {order.paymentStatus === "paid" ? "✅ To'langan" : "❌ To'lanmagan"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.total?.toLocaleString()} so'm
                      </div>
                      {order.discount > 0 && (
                        <div className="text-xs text-green-600">
                          Chegirma: -{order.discount?.toLocaleString()} so'm
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Jami: {order.originalTotal?.toLocaleString()} so'm
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusLabel(order)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatShortDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                          title="Batafsil ko'rish"
                        >
                          <FaEye className="mr-1" />
                          Ko'rish
                        </button>
                        {order.status !== "cancelled" && order.status !== "delivered" && (
                          <button
                            onClick={() => setActionOrder(order)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                            title="Holatni o'zgartirish"
                          >
                            <FaEdit className="mr-1" />
                            Amal
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bo'sh xabar */}
        {sortedOrders.length === 0 && (
          <div className="text-center py-12">
            <FaBoxOpen className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Hech qanday buyurtma topilmadi</p>
            <p className="text-gray-400 text-sm">
              {searchTerm ? "Qidiruv so'zini o'zgartiring yoki filterni olib tashlang" : "Hozircha buyurtmalar mavjud emas"}
            </p>
          </div>
        )}

        {/* Natijalar soni */}
        {sortedOrders.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            {sortedOrders.length} ta buyurtma topildi
          </div>
        )}
      </section>

      {/* Modal lar */}
      {actionOrder && (
        <StatusActionModal
          order={actionOrder}
          onClose={() => setActionOrder(null)}
          onUpdate={handleUpdateStatus}
        />
      )}

      {driverModal && (
        <DriverAssignmentModal
          order={driverModal}
          onClose={() => setDriverModal(null)}
        />
      )}

      {cancelModal && (
        <CancelOrderModal
          order={cancelModal}
          onClose={() => setCancelModal(null)}
        />
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default React.memo(AdminOrders);