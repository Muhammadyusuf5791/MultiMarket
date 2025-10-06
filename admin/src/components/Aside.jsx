// components/Aside.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiMessageSquare,
  FiStar,
  FiLogOut,
  FiUser,
  FiChevronRight,
  FiSettings,
  FiMenu,
  FiX
} from 'react-icons/fi';

const Aside = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingTestimonialsCount, setPendingTestimonialsCount] = useState(0);
  const [openSubmenu, setOpenSubmenu] = useState(null); 
  const location = useLocation();
  const navigate = useNavigate();

  // Sharhlar sonini olish
  useEffect(() => {
    const savedTestimonials = JSON.parse(localStorage.getItem('testimonials')) || [];
    const pendingCount = savedTestimonials.filter(t => !t.approved && !t.rejected).length;
    setPendingTestimonialsCount(pendingCount);
  }, []);
  
  const menuItems = [
    {
      path: '/admin',
      icon: <FiHome className="w-4 h-4" />,
      label: 'Bosh Sahifa',
      exact: true,
      badge: null
    },
    {
      path: '/admin/products',
      icon: <FiPackage className="w-4 h-4" />,
      label: 'Mahsulotlar',
      badge: null,
      submenu: [
        { path: '/admin/products/add', label: 'Yangi Mahsulot' },
        { path: '/admin/products/list', label: 'Barcha Mahsulotlar' }
      ]
    },
    {
      path: '/admin/orders',
      icon: <FiShoppingCart className="w-4 h-4" />,
      label: 'Buyurtmalar',
      badge: null
    },
    {
    path: '/admin/testimonials',
    icon: <FiStar className="w-4 h-4" />,
    label: 'Sharhlar',
    badge: pendingTestimonialsCount
    },
    {
    path: '/admin/chat',
    icon: <FiMessageSquare className="w-4 h-4" />,
    label: 'Xabarlar',
    badge: null
    }
  ];

  useEffect(() => {
    const activeItem = menuItems.find(item => item.submenu && location.pathname.startsWith(item.path));
    if (activeItem) {
      setOpenSubmenu(activeItem.path);
    } else {
      setOpenSubmenu(null);
    }
  }, [location.pathname]);

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const getBadgeCount = (item) => {
    if (item.path === '/admin/testimonials') {
      return pendingTestimonialsCount;
    }
    return item.badge;
  };

  const toggleSubmenu = (path, hasSubmenu) => {
    if (hasSubmenu) {
      setOpenSubmenu(openSubmenu === path ? null : path);
    } else {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button & Overlay ... */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
      >
        <FiMenu className="w-5 h-5" />
      </button>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - FIXED va h-full */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 
        w-56 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        
        // TUZATISH: Katta ekranlarda ham fixed qilib qo'yildi
        lg:translate-x-0 lg:fixed lg:z-auto 
        
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        
        flex flex-col h-full 
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <Link to="/admin" className="flex items-center space-x-2" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">MultiMarket</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation - TUZATISH: min-h-0 menyu g'oyib bo'lmasligi uchun */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto **min-h-0**">
          {menuItems.map((item) => {
            // ... menyu map qismi (o'zgarishsiz) ...
            const hasSubmenu = !!item.submenu;
            const isOpen = hasSubmenu && openSubmenu === item.path;
            
            return (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  onClick={(e) => {
                    if (hasSubmenu) {
                      e.preventDefault(); 
                      toggleSubmenu(item.path, true);
                    } else {
                      toggleSubmenu(item.path, false);
                    }
                  }}
                  className={`
                    flex items-center justify-between px-3 py-2 
                    rounded-lg transition-all duration-200 group
                    text-sm
                    ${isActive(item.path, item.exact) || isOpen
                      ? 'bg-gray-100 text-gray-900 border-r-2 border-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      transition-colors
                      ${isActive(item.path, item.exact) || isOpen
                        ? 'text-gray-900' 
                        : 'text-gray-500 group-hover:text-gray-900'
                      }
                    `}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  
                  {getBadgeCount(item) > 0 && (
                    <span className={`
                      px-1.5 py-0.5 text-xs rounded-full min-w-5 h-5 flex items-center justify-center
                      ${isActive(item.path, item.exact) || isOpen
                        ? 'bg-gray-900 text-white'
                        : 'bg-red-500 text-white'
                      }
                    `}>
                      {getBadgeCount(item)}
                    </span>
                  )}
                  
                  {hasSubmenu && (
                    <FiChevronRight className={`
                      w-4 h-4 transition-transform duration-200
                      ${isOpen ? 'rotate-90' : ''}
                      ${isActive(item.path, item.exact) || isOpen
                        ? 'text-gray-900' 
                        : 'text-gray-400 group-hover:text-gray-600'
                      }
                    `} />
                  )}
                </Link>

                {/* Submenu */}
                {hasSubmenu && isOpen && (
                  <div className="ml-5 mt-1 space-y-1 border-l border-gray-200 pl-3">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          block px-3 py-2 text-xs rounded-lg transition-colors
                          ${location.pathname === subItem.path
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }
                        `}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-gray-200 flex-shrink-0">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            </div>
            
            <div className="flex space-x-1 border-t pt-2 mt-2 border-gray-200">
              <Link
                to="/admin/settings"
                className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <FiSettings className="w-3 h-3" />
                <span>Sozlamalar</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                <FiLogOut className="w-3 h-3" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Aside;