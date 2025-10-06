import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../context/Context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { FaSpinner } from 'react-icons/fa';

const Checkout = () => {
  const { cart, currentUser, clearCart, getCartTotal } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    paymentType: 'delivery',
    notes: '',
  });

  const toastConfig = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
    className: 'bg-red-50 text-red-700 font-medium text-sm rounded-lg',
  };

  // Auto-fill user data
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const { originalTotal, discount, discountPercentage, finalTotal } = getCartTotal();

  // Generate numeric order ID
  const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${timestamp}${random}`;
  };

  // Format phone number
  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `+998${cleaned}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('998')) {
      return `+${cleaned}`;
    } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
      return `+998${cleaned.slice(1)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('9')) {
      return `+998${cleaned}`;
    }
    return phone;
  };

  // Place order
  const placeOrder = async (orderData) => {
    if (!currentUser) {
      console.error('No current user found');
      throw new Error('Buyurtma berish uchun tizimga kiring');
    }
    try {
      console.log('Placing order with data:', orderData);
      console.log('Current user:', currentUser);
      console.log('Cart:', cart);
      
      const orderId = generateOrderId();
      const ordersRef = collection(db, 'orders');
      
      const order = {
        orderId: orderId, // Raqamli ID
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userInfo: {
          fullName: orderData.fullName,
          email: currentUser.email,
          phone: orderData.phone,
          uid: currentUser.uid,
        },
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          total: item.price * item.quantity,
        })),
        orderDetails: {
          fullName: orderData.fullName,
          phone: orderData.phone,
          address: orderData.address,
          paymentType: orderData.paymentType,
          notes: orderData.notes,
        },
        pricing: {
          subtotal: originalTotal,
          discount: discount,
          discountPercentage: discountPercentage,
          total: finalTotal,
        },
        status: 'pending',
        paymentStatus: orderData.paymentType === 'delivery' ? 'pending' : 'unpaid',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      console.log('Order to save:', order);
      const docRef = await addDoc(ordersRef, order);
      console.log('Order saved with ID:', docRef.id, 'Order ID:', orderId);
      
      if (currentUser.uid) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          orders: arrayUnion(docRef.id),
          updatedAt: serverTimestamp(),
        });
        console.log('User document updated with order ID:', docRef.id);
      }
      
      clearCart();
      return { orderId, firebaseId: docRef.id };
    } catch (error) {
      console.error('Place order error:', error.code, error.message, error.stack);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    console.log('Cart:', cart);
    if (cart.length === 0) {
      toast.error('Savat bo\'sh', toastConfig);
      return;
    }
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error('Ism, telefon raqami va manzil kiritilishi shart', toastConfig);
      return;
    }
    const phoneRegex = /^\+998\d{9}$/;
    const formattedPhone = formatPhoneNumber(formData.phone);
    if (!phoneRegex.test(formattedPhone)) {
      toast.error('Iltimos, to\'g\'ri telefon raqamini kiriting (+998901234567)', toastConfig);
      return;
    }
    setLoading(true);
    try {
      const { orderId, firebaseId } = await placeOrder({ ...formData, phone: formattedPhone });
      console.log('Order placed with ID:', orderId, 'Firebase ID:', firebaseId);
      toast.success(`Buyurtmangiz qabul qilindi! Buyurtma raqamingiz: ${orderId}. Tez orada adminlar bog\'lanadi.`, {
        ...toastConfig,
        className: 'bg-green-50 text-green-700 font-medium text-sm rounded-lg',
      });
      setTimeout(() => navigate('/orders'), 2000);
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(`Buyurtma berishda xatolik: ${error.message}`, toastConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Savat bo'sh</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Mahsulotlar sahifasiga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Buyurtma berish</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 border-b pb-3">Ma'lumotlarni kiriting</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ism Familya *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Aliyev Ali"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon raqami *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="+998 90 123 45 67"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Format: +998901234567</p>
              </div>
              {currentUser?.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={currentUser.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yetkazib berish manzili *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Manzilingizni batafsil yozing (ko'cha, uy, kvartira)..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qo'shimcha izoh
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Qo'shimcha talab yoki izoh..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To'lov usuli
                </label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="delivery">Yetkazib berishda to'lov (naqd)</option>
                  <option value="click">Click</option>
                  <option value="payme">Payme</option>
                  <option value="uzum">Uzum Bank</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-lg font-bold transition-all duration-200 flex items-center justify-center ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-[1.02] shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Buyurtma berilmoqda...
                  </>
                ) : (
                  `Buyurtma berish - ${finalTotal.toLocaleString()} so'm`
                )}
              </button>
              {!currentUser && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Eslatma:</strong> Buyurtma berish uchun tizimga kiring. 
                    <button 
                      onClick={() => navigate('/login')}
                      className="text-blue-600 hover:underline ml-1 font-semibold"
                    >
                      Kirish
                    </button>
                  </p>
                </div>
              )}
            </form>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-6 border-b pb-3">Buyurtma tafsilotlari</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x {item.price.toLocaleString()} so'm
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {(item.price * item.quantity).toLocaleString()} so'm
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 pt-4 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Jami summa:</span>
                <span>{originalTotal.toLocaleString()} so'm</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Chegirma ({discountPercentage}%):</span>
                  <span>-{discount.toLocaleString()} so'm</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Yakuniy summa:</span>
                <span className="text-blue-600">{finalTotal.toLocaleString()} so'm</span>
              </div>
            </div>
            {discount > 0 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm font-semibold">
                  🎉 Siz {discountPercentage}% chegirma qo'lga kiritdingiz!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;