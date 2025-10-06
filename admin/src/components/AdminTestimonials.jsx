// AdminTestimonials.js
import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.jsx";
import { toast } from "react-toastify";
import { FiCheck, FiX, FiClock, FiFilter, FiSearch, FiStar, FiUser, FiCalendar, FiTrash2, FiRefreshCw } from "react-icons/fi";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "testimonials"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const testimonialsData = [];
      querySnapshot.forEach((doc) => {
        testimonialsData.push({ id: doc.id, ...doc.data() });
      });
      setTestimonials(testimonialsData);
      setFilteredTestimonials(testimonialsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter testimonials based on active tab and search
  useEffect(() => {
    let filtered = testimonials;

    // Tab filter
    if (activeTab === "pending") {
      filtered = filtered.filter(t => !t.approved && !t.rejected);
    } else if (activeTab === "approved") {
      filtered = filtered.filter(t => t.approved);
    } else if (activeTab === "rejected") {
      filtered = filtered.filter(t => t.rejected);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.text?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTestimonials(filtered);
  }, [testimonials, activeTab, searchTerm]);

  const approveTestimonial = async (id) => {
    try {
      await updateDoc(doc(db, "testimonials", id), {
        approved: true,
        rejected: false
      });
      toast.success("Sharh tasdiqlandi!");
    } catch (error) {
      console.error("Tasdiqlash xatosi:", error);
      toast.error("Tasdiqlashda xatolik yuz berdi");
    }
  };

  const rejectTestimonial = async (id) => {
    try {
      await updateDoc(doc(db, "testimonials", id), {
        approved: false,
        rejected: true
      });
      toast.success("Sharh rad etildi!");
    } catch (error) {
      console.error("Rad etish xatosi:", error);
      toast.error("Rad etishda xatolik yuz berdi");
    }
  };

  const deleteTestimonial = async (id) => {
    if (window.confirm("Haqiqatan ham bu sharhni o'chirmoqchimisiz?")) {
      try {
        await deleteDoc(doc(db, "testimonials", id));
        toast.success("Sharh o'chirildi!");
      } catch (error) {
        console.error("O'chirish xatosi:", error);
        toast.error("O'chirishda xatolik yuz berdi");
      }
    }
  };

  const restoreTestimonial = async (id) => {
    try {
      await updateDoc(doc(db, "testimonials", id), {
        approved: false,
        rejected: false
      });
      toast.success("Sharh qayta tiklandi!");
    } catch (error) {
      console.error("Qayta tiklash xatosi:", error);
      toast.error("Qayta tiklashda xatolik yuz berdi");
    }
  };

  // Count statistics
  const stats = {
    all: testimonials.length,
    pending: testimonials.filter(t => !t.approved && !t.rejected).length,
    approved: testimonials.filter(t => t.approved).length,
    rejected: testimonials.filter(t => t.rejected).length
  };

  const getStatusBadge = (testimonial) => {
    if (testimonial.approved) {
      return {
        text: "Tasdiqlangan",
        color: "bg-green-100 text-green-800",
        icon: <FiCheck className="w-3 h-3" />
      };
    } else if (testimonial.rejected) {
      return {
        text: "Rad etilgan",
        color: "bg-red-100 text-red-800",
        icon: <FiX className="w-3 h-3" />
      };
    } else {
      return {
        text: "Kutilmoqda",
        color: "bg-yellow-100 text-yellow-800",
        icon: <FiClock className="w-3 h-3" />
      };
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '';
    return timestamp.toDate().toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Sharhlarni Boshqarish</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-24 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Sarlavha */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sharhlarni Boshqarish</h1>
        <p className="text-gray-600">Mijoz sharhlarini tasdiqlang yoki rad eting</p>
      </div>

      {/* Statistik Kartalar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami Sharhlar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.all}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FiFilter className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kutilayotgan</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasdiqlangan</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FiCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rad etilgan</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FiX className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter va Qidiruv */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Tab Filter */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: "all", label: "Barchasi", count: stats.all },
              { key: "pending", label: "Kutilayotgan", count: stats.pending },
              { key: "approved", label: "Tasdiqlangan", count: stats.approved },
              { key: "rejected", label: "Rad etilgan", count: stats.rejected }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.key ? "bg-gray-200 text-gray-700" : "bg-gray-300 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Ism yoki sharh bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sharhlar Ro'yxati */}
      <div className="space-y-4">
        {filteredTestimonials.map((testimonial) => {
          const status = getStatusBadge(testimonial);
          
          return (
            <div
              key={testimonial.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Sharh Ma'lumotlari */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{testimonial.author}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.icon}
                            <span>{status.text}</span>
                          </span>
                          {testimonial.rating && (
                            <span className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                              <FiStar className="w-3 h-3" />
                              <span>{testimonial.rating}/5</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">"{testimonial.text}"</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FiCalendar className="w-4 h-4" />
                      <span>{formatDate(testimonial.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Amallar */}
                <div className="flex flex-col space-y-2 min-w-[140px]">
                  {!testimonial.approved && !testimonial.rejected && (
                    <>
                      <button
                        onClick={() => approveTestimonial(testimonial.id)}
                        className="flex items-center justify-center space-x-2 bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                      >
                        <FiCheck className="w-4 h-4" />
                        <span>Tasdiqlash</span>
                      </button>
                      <button
                        onClick={() => rejectTestimonial(testimonial.id)}
                        className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        <FiX className="w-4 h-4" />
                        <span>Rad etish</span>
                      </button>
                    </>
                  )}

                  {(testimonial.approved || testimonial.rejected) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => restoreTestimonial(testimonial.id)}
                        className="flex-1 flex items-center justify-center space-x-1 bg-gray-200 text-gray-700 px-2 py-2 rounded-lg hover:bg-gray-300 transition-colors text-xs"
                      >
                        <FiRefreshCw className="w-3 h-3" />
                        <span>Tiklash</span>
                      </button>
                      <button
                        onClick={() => deleteTestimonial(testimonial.id)}
                        className="flex-1 flex items-center justify-center space-x-1 bg-red-100 text-red-700 px-2 py-2 rounded-lg hover:bg-red-200 transition-colors text-xs"
                      >
                        <FiTrash2 className="w-3 h-3" />
                        <span>O'chirish</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredTestimonials.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sharhlar topilmadi</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `"${searchTerm}" bo'yicha hech narsa topilmadi` 
                : activeTab === "all" 
                ? "Hozircha sharhlar mavjud emas" 
                : `${activeTab === "pending" ? "Kutilayotgan" : activeTab === "approved" ? "Tasdiqlangan" : "Rad etilgan"} sharhlar mavjud emas`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;