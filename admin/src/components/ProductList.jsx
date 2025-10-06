// components/ProductList.jsx
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiPackage, FiSearch, FiFilter, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const ProductList = () => {
  const { 
    products, 
    loading, 
    updateProductInFirebase, 
    deleteProductFromFirebase,
    fetchProductsFromFirebase 
  } = useContext(AdminContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    price: '',
    category: '',
    image: null
  });
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'Barchasi' },
    { value: 'elektr', label: 'Elektr' },
    { value: 'santexnika', label: 'Santexnika' },
  ];

  // Mahsulotlarni yuklash
  useEffect(() => {
    fetchProductsFromFirebase();
  }, []);

  // Filtrlash
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Tahrirlashni boshlash
  const startEdit = (product) => {
    setEditingProduct(product.id);
    setEditForm({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image
    });
  };

  // Tahrirlashni bekor qilish
  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({
      title: '',
      price: '',
      category: '',
      image: null
    });
  };

  // Rasmni yangilash
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm({
          ...editForm,
          image: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔥 YANGILANDI: Firebase'da mahsulotni yangilash
  const updateProduct = async (productId) => {
    try {
      await updateProductInFirebase(productId, editForm);
      // Toast Context ichida ko'rsatiladi, shuning uchun bu yerda qayta chaqirish shart emas
      setEditingProduct(null);
    } catch (error) {
      console.error('Xatolik:', error);
      // Xatolik toast Context ichida ko'rsatiladi
    }
  };

  // 🔥 YANGILANDI: Firebase'dan mahsulotni o'chirish
  const deleteProduct = async (productId, productTitle) => {
    if (window.confirm(`"${productTitle}" mahsulotini o'chirishni tasdiqlaysizmi?`)) {
      try {
        await deleteProductFromFirebase(productId);
        // Toast Context ichida ko'rsatiladi
      } catch (error) {
        console.error('Xatolik:', error);
        // Xatolik toast Context ichida ko'rsatiladi
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mahsulotlar Ro'yxati</h1>
          <p className="text-gray-600">Barcha mahsulotlarni boshqarish</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/add')}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Yangi Mahsulot</span>
        </button>
      </div>

      {/* Filter va Qidiruv */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Qidiruv */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Mahsulot nomi bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Kategoriya filter */}
          <div className="w-full md:w-48">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mahsulotlar Jadvali */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mahsulot
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Narx
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategoriya
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      {editingProduct === product.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Mahsulot nomi"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditImageChange}
                            className="w-full text-sm"
                          />
                          {editForm.image && (
                            <img 
                              src={editForm.image} 
                              alt="Preview" 
                              className="w-16 h-16 object-cover rounded border"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-10 h-10 object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{product.title}</p>
                          </div>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 py-4">
                      {editingProduct === product.id ? (
                        <input
                          type="text"
                          value={editForm.price}
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Narx"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{product.price} so'm</p>
                      )}
                    </td>
                    
                    <td className="px-4 py-4">
                      {editingProduct === product.id ? (
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {categories.filter(cat => cat.value !== 'all').map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {categories.find(cat => cat.value === product.category)?.label}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                    
                    <td className="px-4 py-4">
                      {editingProduct === product.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateProduct(product.id)}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                          >
                            Saqlash
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                          >
                            Bekor
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Tahrirlash"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id, product.title)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="O'chirish"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Mahsulotlar topilmadi</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterCategory !== 'all' 
                ? 'Qidiruv shartlariga mos mahsulot topilmadi' 
                : 'Hozircha mahsulotlar mavjud emas'}
            </p>
            <button
              onClick={() => navigate('/admin/products/add')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Birinchi mahsulot qo'shing
            </button>
          </div>
        )}
      </div>

      {/* Statistik ma'lumot */}
      <div className="mt-4 text-sm text-gray-500">
        Jami: {filteredProducts.length} ta mahsulot
      </div>
    </div>
  );
};

export default ProductList;