// admin/src/context/AdminContext.jsx
import { createContext, useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  orderBy,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 MAHSULOTLAR FUNCTIONS
  const fetchProductsFromFirebase = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const productsList = [];
      querySnapshot.forEach((doc) => {
        productsList.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setProducts(productsList);
      
    } catch (error) {
      console.error('Mahsulotlarni yuklashda xatolik:', error);
      toast.error('Mahsulotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const addProductToFirebase = async (productData) => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, 'products'), {
        title: productData.title,
        price: productData.price,
        category: productData.category,
        image: productData.image,
        createdAt: new Date().toISOString()
      });

      const newProduct = {
        id: docRef.id,
        title: productData.title,
        price: productData.price,
        category: productData.category,
        image: productData.image,
        createdAt: new Date().toISOString()
      };

      setProducts(prev => [newProduct, ...prev]);
      
      toast.success('Mahsulot muvaffaqiyatli qo\'shildi!');
      return docRef.id;

    } catch (error) {
      console.error('Mahsulot qo\'shishda xatolik:', error);
      toast.error('Mahsulot qo\'shishda xatolik: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProductInFirebase = async (productId, updatedData) => {
    try {
      setLoading(true);
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });

      setProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, ...updatedData }
            : product
        )
      );

      toast.success('Mahsulot muvaffaqiyatli yangilandi!');
      
    } catch (error) {
      console.error('Mahsulotni yangilashda xatolik:', error);
      toast.error('Yangilashda xatolik: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProductFromFirebase = async (productId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'products', productId));

      setProducts(prev => prev.filter(product => product.id !== productId));
      
      toast.success('Mahsulot muvaffaqiyatli o\'chirildi!');
      
    } catch (error) {
      console.error('Mahsulotni o\'chirishda xatolik:', error);
      toast.error('O\'chirishda xatolik: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔥 BUYURTMALAR FUNCTIONS
  const fetchOrdersFromFirebase = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const ordersList = [];
      querySnapshot.forEach((doc) => {
        ordersList.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setOrders(ordersList);
      
    } catch (error) {
      console.error('Buyurtmalarni yuklashda xatolik:', error);
      toast.error('Buyurtmalarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  // Real-time orders listener
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersList = [];
      querySnapshot.forEach((doc) => {
        ordersList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setOrders(ordersList);
    }, (error) => {
      console.error('Real-time orders error:', error);
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      // Real-time listener orqali avtomatik yangilanadi
      toast.success('Buyurtma statusi muvaffaqiyatli yangilandi!');
      
    } catch (error) {
      console.error('Status yangilashda xatolik:', error);
      toast.error('Status yangilashda xatolik: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const assignDriverToOrder = async (orderId, driverInfo) => {
    try {
      setLoading(true);
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: 'driver_assigned',
        driver: driverInfo,
        assignedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast.success('Haydovchi muvaffaqiyatli tayinlandi!');
      
    } catch (error) {
      console.error('Haydovchi tayinlashda xatolik:', error);
      toast.error('Haydovchi tayinlashda xatolik: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId, reason = '') => {
    try {
      setLoading(true);
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast.success('Buyurtma muvaffaqiyatli bekor qilindi!');
      
    } catch (error) {
      console.error('Buyurtmani bekor qilishda xatolik:', error);
      toast.error('Buyurtmani bekor qilishda xatolik: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeOrder = async (orderId) => {
    try {
      setLoading(true);
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: 'delivered',
        deliveredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast.success('Buyurtma yetkazib berildi!');
      
    } catch (error) {
      console.error('Buyurtmani yakunlashda xatolik:', error);
      toast.error('Buyurtmani yakunlashda xatolik: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Komponent yuklanganda ma'lumotlarni olish
  useEffect(() => {
    fetchProductsFromFirebase();
    fetchOrdersFromFirebase();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        // Products
        products,
        loading,
        addProductToFirebase,
        updateProductInFirebase,
        deleteProductFromFirebase,
        fetchProductsFromFirebase,
        
        // Orders
        orders,
        updateOrderStatus,
        assignDriverToOrder,
        cancelOrder,
        completeOrder,
        fetchOrdersFromFirebase
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;