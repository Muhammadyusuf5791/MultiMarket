// frontend/src/components/CartTotal.jsx
import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoTrash } from "react-icons/go";
import { Context } from "../context/Context";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const CartTotal = () => {
  const { t } = useTranslation();
  const { currentUser, cart, count, clearCart, increaseQuantity, decreaseQuantity, removeFromCart, setCart } =
    useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Discount thresholds
  const DISCOUNT_THRESHOLDS = [
    { amount: 2000000, discount: 12 },
    { amount: 1000000, discount: 8 },
    { amount: 500000, discount: 5 },
  ];

  // Toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  // Load cart from Firestore
  useEffect(() => {
    const loadCartFromFirebase = async () => {
      if (currentUser) {
        try {
          console.log('Loading cart for user:', currentUser.uid);
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.cart && userData.cart.length > 0) {
              setCart(userData.cart);
              console.log('Cart loaded from Firestore:', userData.cart);
            }
          }
        } catch (error) {
          console.error("Error loading cart from Firebase:", error.code, error.message);
        }
      }
    };
    loadCartFromFirebase();
  }, [currentUser, setCart]);

  // Save cart to Firestore
  const saveCartToFirebase = async (updatedCart) => {
    if (!currentUser) return;
    try {
      console.log('Saving cart to Firestore:', updatedCart);
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        cart: updatedCart,
        updatedAt: new Date().toISOString(),
      });
      console.log('Cart saved to Firestore');
    } catch (error) {
      console.error("Error saving cart to Firebase:", error.code, error.message);
      if (error.code === "not-found") {
        try {
          await setDoc(doc(db, "users", currentUser.uid), {
            uid: currentUser.uid,
            email: currentUser.email,
            fullName: currentUser.fullName || "",
            cart: updatedCart,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          console.log('User document created with cart');
        } catch (createError) {
          console.error("Error creating user document:", createError);
        }
      }
    }
  };

  // Calculate total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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

  // Get next discount threshold
  const getNextThreshold = (totalAmount) => {
    const sortedThresholds = [...DISCOUNT_THRESHOLDS].sort((a, b) => b.amount - a.amount);
    for (const threshold of sortedThresholds) {
      if (totalAmount < threshold.amount) {
        return threshold;
      }
    }
    return null;
  };

  const discount = calculateDiscount(total);
  const finalTotal = total - discount.amount;
  const nextThreshold = getNextThreshold(total);

  // Handle cart operations
  const handleRemoveFromCart = async (itemId, title) => {
    removeFromCart(itemId);
    if (currentUser) {
      await saveCartToFirebase(cart.filter(item => item.id !== itemId));
    }
    toast.success(t("cart.removeSuccess", { title }), {
      ...toastConfig,
      className: "bg-green-50 text-green-700 font-medium text-sm rounded-lg",
    });
  };

  const handleIncreaseQuantity = async (itemId, title) => {
    increaseQuantity(itemId);
    if (currentUser) {
      await saveCartToFirebase(cart.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    }
    toast.success(t("cart.quantityUpdated", { title }), {
      ...toastConfig,
      className: "bg-green-50 text-green-700 font-medium text-sm rounded-lg",
    });
  };

  const handleDecreaseQuantity = async (itemId, title) => {
    decreaseQuantity(itemId);
    if (currentUser) {
      await saveCartToFirebase(cart.map(item =>
        item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      ));
    }
    toast.success(t("cart.quantityUpdated", { title }), {
      ...toastConfig,
      className: "bg-green-50 text-green-700 font-medium text-sm rounded-lg",
    });
  };

  const handleClearCart = async () => {
    clearCart();
    if (currentUser) {
      await saveCartToFirebase([]);
    }
    toast.success(t("cart.clearSuccess"), {
      ...toastConfig,
      className: "bg-green-50 text-green-700 font-medium text-sm rounded-lg",
    });
  };

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error(t("cart.loginRequired"), {
        ...toastConfig,
        className: "bg-red-50 text-red-700 font-medium text-sm rounded-lg",
      });
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-center text-xl sm:text-2xl font-semibold py-10 text-gray-700">
            {t("cart.emptyCart", { count })}
          </h2>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              aria-label={t("cart.returnHomeAria")}
            >
              {t("cart.returnHome")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {t("cart.title", { count })}
          </h2>
          <button
            onClick={handleClearCart}
            className="text-red-500 font-bold hover:text-red-700 transition"
            aria-label={t("cart.clearCartAria")}
          >
            {t("cart.clearCart")}
          </button>
        </div>
        <div className="grid gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md p-4 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                <img
                  src={item.image}
                  alt={t("cart.productAlt", { title: item.title })}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded"
                  loading="lazy"
                />
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-blue-600 font-bold">
                    {item.price.toLocaleString()} {t("cart.currency")} × {item.quantity}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <button
                  onClick={() => handleDecreaseQuantity(item.id, item.title)}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  aria-label={t("cart.decreaseQuantityAria", { title: item.title })}
                >
                  −
                </button>
                <span className="font-bold w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => handleIncreaseQuantity(item.id, item.title)}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  aria-label={t("cart.increaseQuantityAria", { title: item.title })}
                >
                  +
                </button>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-base sm:text-lg">
                  {(item.price * item.quantity).toLocaleString()} {t("cart.currency")}
                </p>
                <button
                  onClick={() => handleRemoveFromCart(item.id, item.title)}
                  className="text-xl"
                  aria-label={t("cart.removeItemAria", { title: item.title })}
                >
                  <GoTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            {t("cart.summaryTitle")}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t("cart.subtotal")}</span>
              <span className="font-medium">
                {total.toLocaleString()} {t("cart.currency")}
              </span>
            </div>
            {discount.percentage > 0 && (
              <div className="flex justify-between text-green-600">
                <span>
                  {t("cart.discount", { percentage: discount.percentage })}
                </span>
                <span className="font-medium">
                  -{discount.amount.toLocaleString()} {t("cart.currency")}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>{t("cart.total")}</span>
                <span>
                  {finalTotal.toLocaleString()} {t("cart.currency")}
                </span>
              </div>
            </div>
          </div>
          {nextThreshold && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                {t("cart.discountOpportunity")}
              </h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(100, (total / nextThreshold.amount) * 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-blue-700 mt-2">
                {t("cart.discountMessage", {
                  remaining: (nextThreshold.amount - total).toLocaleString(),
                  percentage: nextThreshold.discount,
                })}
              </p>
            </div>
          )}
          <button
            onClick={handleCheckout}
            className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-base sm:text-lg"
            aria-label={t("cart.checkoutAria")}
          >
            {t("cart.checkout")}
          </button>
          {!currentUser && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              {t("cart.loginNotice")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default React.memo(CartTotal);