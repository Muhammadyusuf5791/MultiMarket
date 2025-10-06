// admin/src/components/ProductAdd.jsx
import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { FiUpload, FiPackage, FiDollarSign, FiTag } from 'react-icons/fi';
import { AdminContext } from '../context/AdminContext.jsx'; // 🔥 Admin Context

const ProductAdd = () => {
  const { addProductToFirebase, loading } = useContext(AdminContext);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'elektr',
    image: null
  });

  const categories = [
    { value: 'elektr', label: 'Elektr' },
    { value: 'santexnika', label: 'Santexnika' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Rasm hajmi 2MB dan kichik bo\'lishi kerak');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          image: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.image) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }

    try {
      await addProductToFirebase(formData);
      
      // Formani tozalash
      setFormData({
        title: '',
        price: '',
        category: 'elektr',
        image: null
      });
      document.getElementById('imageInput').value = '';

      toast.success('Mahsulot muvaffaqiyatli qo\'shildi!');
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error('Mahsulot qo\'shishda xatolik yuz berdi');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Yangi Mahsulot Qo'shish</h1>
        <p className="text-gray-600">Yangi mahsulot ma'lumotlarini kiriting</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-lg">
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <FiPackage className="w-4 h-4 text-blue-600" />
            <span>Mahsulot nomi *</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Masalan: Elektr schotchik"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <FiDollarSign className="w-4 h-4 text-blue-600" />
            <span>Narx *</span>
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Masalan: 210,000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <FiTag className="w-4 h-4 text-blue-600" />
            <span>Kategoriya *</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 bg-white"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <FiUpload className="w-4 h-4 text-blue-600" />
            <span>Mahsulot rasmi *</span>
          </label>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            required
          />
          {formData.image && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-600 mb-2 font-medium">Tanlangan rasm:</p>
              <img 
                src={formData.image} 
                alt="Preview" 
                className="w-32 h-32 object-contain rounded-lg border border-gray-300 shadow-sm"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !formData.image}
          className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 shadow-md ${
            loading || !formData.image
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-[1.01]'
          }`}
        >
          {loading ? 'Qo\'shilmoqda...' : 'Mahsulot Qo\'shish'}
        </button>
      </form>
    </div>
  );
};

export default ProductAdd;