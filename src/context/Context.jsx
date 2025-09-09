import { createContext, useState, useEffect } from "react";

export const Context = createContext();

export default function ContextProvider({ children }) {
  const initialCart = JSON.parse(localStorage.getItem("cart")) || [];
  const [cart, setCart] = useState(initialCart);

  // Umumiy count = barcha quantity yig‘indisi
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

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
      }}
    >
      {children}
    </Context.Provider>
  );
}
