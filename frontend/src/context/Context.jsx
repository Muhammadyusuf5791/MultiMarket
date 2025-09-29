import { createContext, useState, useEffect } from "react";

export const Context = createContext();

export default function ContextProvider({ children }) {
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

  // Cart count
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Chegirma foizlari
  const DISCOUNT_THRESHOLDS = [
    { amount: 2000000, discount: 12 },
    { amount: 1000000, discount: 8 },
    { amount: 500000, discount: 5 },
  ];

  // Chegirma hisoblash
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

  // 🛒 Cart funksiyalar
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
  };

  // 🛒 Calculate cart total with discount
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

  // 📦 Buyurtma joylash
  const placeOrder = (form) => {
    if (!currentUser) return; // Prevent unauthenticated users from placing orders

    const paymentStatus = form.paymentType === "delivery" ? "cash" : "unpaid";
    const status = ["payme", "click"].includes(form.paymentType.toLowerCase())
      ? "cancelled" // Set status to "cancelled" for unpaid payme/click orders
      : "pending"; // Set status to "pending" for delivery orders

    const originalTotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const discount = calculateDiscount(originalTotal);
    const total = originalTotal - discount.amount;

    const newOrder = {
      id: Date.now(),
      user: currentUser.email,
      fullName: form.fullName,
      phone: form.phone,
      address: form.address,
      items: cart.map((item) => ({
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
      paymentType: form.paymentType,
      paymentStatus,
      status,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [...prev, newOrder]);
    setCart([]);
  };

  // 📝 Buyurtmani bekor qilish
  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
  };

  // 🔍 Foydalanuvchiga tegishli buyurtmalarni olish
  const getUserOrders = () => {
    if (!currentUser) return [];
    return orders.filter((order) => order.user === currentUser.email);
  };

  // ✅ LocalStorage sync
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

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
      }}
    >
      {children}
    </Context.Provider>
  );
}