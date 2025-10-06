// components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage,
  FiShoppingCart,
  FiMessageSquare,
  FiStar,
  FiUsers,
  FiDollarSign
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    testimonials: 0,
    messages: 0
  });

  useEffect(() => {
    // Statistik ma'lumotlarni yuklash
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];

    setStats({
      products: products.length,
      orders: orders.length,
      testimonials: testimonials.length,
      messages: messages.length
    });
  }, []);

  const statCards = [
    {
      title: 'Jami Mahsulotlar',
      value: stats.products,
      icon: <FiPackage className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
      link: '/admin/products'
    },
    {
      title: 'Yangi Buyurtmalar',
      value: stats.orders,
      icon: <FiShoppingCart className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600',
      link: '/admin/orders'
    },
    {
      title: 'Sharhlar',
      value: stats.testimonials,
      icon: <FiStar className="w-6 h-6" />,
      color: 'bg-yellow-100 text-yellow-600',
      link: '/admin/testimonials'
    },
    {
      title: 'Xabarlar',
      value: stats.messages,
      icon: <FiMessageSquare className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600',
      link: '/admin/chat'
    }
  ];

  const quickActions = [
    {
      title: 'Yangi Mahsulot',
      description: 'Yangi mahsulot qo\'shish',
      icon: <FiPackage className="w-5 h-5" />,
      link: '/admin/products/add',
      color: 'bg-white border border-gray-200 hover:border-gray-300'
    },
    {
      title: 'Buyurtmalar',
      description: 'Barcha buyurtmalar',
      icon: <FiShoppingCart className="w-5 h-5" />,
      link: '/admin/orders',
      color: 'bg-white border border-gray-200 hover:border-gray-300'
    },
    {
      title: 'Sharhlar',
      description: 'Mijoz sharhlari',
      icon: <FiStar className="w-5 h-5" />,
      link: '/admin/testimonials',
      color: 'bg-white border border-gray-200 hover:border-gray-300'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sarlavha */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Boshqaruv Paneli</h1>
        <p className="text-gray-600">Sistemangizning umumiy holati</p>
      </div>

      {/* Statistikalar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tezkor Amallar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tezkor Amallar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`flex items-center p-4 rounded-lg hover:shadow-sm transition-shadow ${action.color}`}
            >
              <div className="flex-shrink-0">
                {action.icon}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* So'nggi Faollik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">So'nggi Mahsulotlar</h2>
          <div className="space-y-3">
            {(() => {
              const products = JSON.parse(localStorage.getItem('products')) || [];
              const recentProducts = products.slice(-3).reverse();
              
              return recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{product.title}</p>
                        <p className="text-sm text-gray-600">{product.price} so'm</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Hozircha mahsulotlar mavjud emas</p>
              );
            })()}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">So'nggi Sharhlar</h2>
          <div className="space-y-3">
            {(() => {
              const testimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
              const recentTestimonials = testimonials.slice(-3).reverse();
              
              return recentTestimonials.length > 0 ? (
                recentTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">"{testimonial.text}"</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(testimonial.createdAt).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Hozircha sharhlar mavjud emas</p>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;