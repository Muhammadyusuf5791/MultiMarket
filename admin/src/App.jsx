// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Aside from './components/Aside';
import AdminTestimonials from './components/AdminTestimonials';
import ProductAdd from './components/ProductAdd';
import ProductList from './components/ProductList';
import AdminOrders from './components/AdminOrders';
import AdminChat from './components/AdminChat';
import AdminDashboard from './components/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin Layout komponenti
const AdminLayout = ({ children }) => {
  return (
    // h-screen (100vh) va flex
    <div className="flex h-screen bg-gray-50">
      
      {/* Aside: fixed va h-full */}
      <Aside />
      
      {/* Content: lg:ml-56 Aside joyi uchun bo'shliq yaratadi. overflow-y-auto skrollni boshqaradi */}
      <div className="flex-1 lg:ml-56 overflow-y-auto">
        <main className="p-4 min-h-full"> 
          {children}  
        </main>
      </div>
    </div>
  );
};

const App = () => {
  // Eslatma: Agar Kategoriyalar.js ham App ichida Route bilan joylashgan bo'lsa,
  // uni ham shu yerda AdminLayoutsiz e'lon qilish kerak.
  
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/products" element={<AdminLayout><ProductList /></AdminLayout>} />
        <Route path="/admin/products/add" element={<AdminLayout><ProductAdd /></AdminLayout>} />
        <Route path="/admin/products/list" element={<AdminLayout><ProductList /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
        <Route path="/admin/testimonials" element={<AdminLayout><AdminTestimonials /></AdminLayout>} />
        <Route path="/admin/chat" element={<AdminLayout><AdminChat /></AdminLayout>} />
        
        {/* Default route */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Not found */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-4">Sahifa topilmadi</p>
              <a href="/admin" className="text-blue-600 hover:text-blue-700">
                Admin panelga qaytish
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;