// frontend/src/context/Context.jsx
import { createContext, useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  orderBy,
  query 
} from 'firebase/firestore';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { toast } from 'react-toastify';

// Named export for Context
export const Context = createContext();

// Default export for ContextProvider
const ContextProvider = ({ children }) => {
  // Cart
  const initialCart = JSON.parse(localStorage.getItem("cart")) || [];
  const [cart, setCart] = useState(initialCart);

  // Current user
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  // Orders
  const [orders, setOrders] = useState(
    JSON.parse(localStorage.getItem("orders")) || []
  );

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cart count
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Discount thresholds
  const DISCOUNT_THRESHOLDS = [
    { amount: 2000000, discount: 12 },
    { amount: 1000000, discount: 8 },
    { amount: 500000, discount: 5 },
  ];

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const userData = user
        ? { uid: user.uid, email: user.email, fullName: user.displayName || '' }
        : null;
      setCurrentUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      console.log('Auth state changed:', userData);
    });
    return () => unsubscribe();
  }, []);

  // Firebase Functions

  // Fetch products from Firestore
  const fetchProductsFromFirebase = async () => {
    try {
      setLoading(true);
      console.log("Fetching products from Firestore...");
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched products:", productsList.length);
      setProducts(productsList);
    } catch (error) {
      console.error('Error fetching products:', error.code, error.message);
      toast.error('Mahsulotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders from Firestore (for admin panel)
  const fetchOrdersFromFirebase = async () => {
    try {
      setLoading(true);
      console.log("Fetching orders from Firestore...");
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched orders:", ordersList.length);
      setOrders(ordersList);
      localStorage.setItem('orders', JSON.stringify(ordersList));
    } catch (error) {
      console.error('Error fetching orders:', error.code, error.message);
      toast.error('Buyurtmalarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  // Add product to Firestore
  const addProductToFirebase = async (productData) => {
    try {
      setLoading(true);
      console.log("Adding product:", productData);
      const docRef = await addDoc(collection(db, 'products'), {
        title: productData.title,
        price: productData.price,
        category: productData.category,
        image: productData.image,
        createdAt: new Date().toISOString(),
      });
      console.log("Product added, ID:", docRef.id);
      const newProduct = {
        id: docRef.id,
        ...productData,
        createdAt: new Date().toISOString(),
      };
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Mahsulot muvaffaqiyatli qo\'shildi!');
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error.code, error.message);
      toast.error('Mahsulot qo\'shishda xatolik: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update product in Firestore
  const updateProductInFirebase = async (productId, updatedData) => {
    try {
      setLoading(true);
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      });
      setProducts(prev =>
        prev.map(product =>
          product.id === productId ? { ...product, ...updatedData } : product
        )
      );
      toast.success('Mahsulot muvaffaqiyatli yangilandi!');
    } catch (error) {
      console.error('Error updating product:', error.code, error.message);
      toast.error('Yangilashda xatolik: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete product from Firestore
  const deleteProductFromFirebase = async (productId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'products', productId));
      setProducts(prev => prev.filter(product => product.id !== productId));
      toast.success('Mahsulot muvaffaqiyatli o\'chirildi!');
    } catch (error) {
      console.error('Error deleting product:', error.code, error.message);
      toast.error('O\'chirishda xatolik: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Calculate discount
  const calculateDiscount = (totalAmount) => {
    for (const threshold of DISCOUNT_THRESHOLDS) {
      if (totalAmount >= threshold.amount) {
        return {
          percentage: threshold.discount,
          amount: Math.round((totalAmount * threshold.discount) / 100),
        };
      }
    }
    return { percentage: 0, amount: 0 };
  };

  // Cart functions
  const addToCart = (product) => {
    const numericPrice = parseInt(product.price.toString().replace(/,/g, ""), 10);
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, price: numericPrice, quantity: 1 }];
      }
    });
    toast.success(`${product.title} savatga qo'shildi!`);
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    return [];
  };

  // Calculate cart total with discount
  const getCartTotal = () => {
    const originalTotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const discount = calculateDiscount(originalTotal);
    return {
      originalTotal,
      discount: discount.amount,
      discountPercentage: discount.percentage,
      finalTotal: originalTotal - discount.amount,
    };
  };

  // Place order
  const placeOrder = async (formData) => {
    if (!currentUser) {
      throw new Error('Buyurtma berish uchun tizimga kiring');
    }
    try {
      setLoading(true);
      console.log('Placing order with formData:', formData);
      
      // Generate numeric order ID
      const generateOrderId = () => {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${timestamp}${random}`;
      };

      const orderId = generateOrderId();
      const originalTotal = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const discount = calculateDiscount(originalTotal);
      const total = originalTotal - discount.amount;
      
      const newOrder = {
        orderId: orderId, // Raqamli ID qo'shildi
        user: currentUser.email,
        userId: currentUser.uid,
        userInfo: { // Foydalanuvchi ma'lumotlari qo'shildi
          fullName: formData.fullName,
          email: currentUser.email,
          phone: formData.phone,
          uid: currentUser.uid,
        },
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        total,
        originalTotal,
        discount: discount.amount,
        discountPercentage: discount.percentage,
        paymentType: formData.paymentType,
        paymentStatus: formData.paymentType === "delivery" ? "cash" : "unpaid",
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      
      console.log('Order to save:', newOrder);
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      console.log('Order saved with ID:', docRef.id, 'Order ID:', orderId);
      
      const orderWithId = { ...newOrder, id: docRef.id };
      setOrders(prev => [...prev, orderWithId]);
      localStorage.setItem('orders', JSON.stringify([...orders, orderWithId]));
      setCart([]);
      localStorage.removeItem('cart');
      toast.success(`Buyurtma muvaffaqiyatli joylashtirildi! Buyurtma raqamingiz: ${orderId}`);
      return { orderId, firebaseId: docRef.id };
    } catch (error) {
      console.error('Place order error:', error.code, error.message, error.stack);
      toast.error('Buyurtma joylashda xatolik: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
  };

  // Get user orders
  const getUserOrders = () => {
    if (!currentUser) return [];
    return orders.filter((order) => order.user === currentUser.email);
  };

  // LocalStorage and Firestore sync
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (currentUser) {
      const saveCartToFirebase = async () => {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userRef, { cart, updatedAt: new Date().toISOString() });
          console.log('Cart synced to Firestore');
        } catch (error) {
          console.error('Error syncing cart:', error.code, error.message);
          if (error.code === 'not-found') {
            await setDoc(doc(db, 'users', currentUser.uid), {
              uid: currentUser.uid,
              email: currentUser.email,
              fullName: currentUser.fullName || '',
              cart,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            console.log('User document created with cart');
          }
        }
      };
      saveCartToFirebase();
    }
  }, [cart, currentUser]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Fetch products and orders on mount
  useEffect(() => {
    fetchProductsFromFirebase();
    if (currentUser && ['admin@example.com', 'superadmin@example.com'].includes(currentUser.email)) {
      fetchOrdersFromFirebase();
    }
  }, [currentUser]);

  return (
    <Context.Provider
      value={{
        cart,
        count,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        removeFromCart,
        currentUser,
        setCurrentUser,
        placeOrder,
        getUserOrders,
        orders,
        cancelOrder,
        getCartTotal,
        products,
        loading,
        addProductToFirebase,
        updateProductInFirebase,
        deleteProductFromFirebase,
        fetchProductsFromFirebase,
        fetchOrdersFromFirebase,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;