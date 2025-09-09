import React, { useContext } from "react";
import { Context } from "../context/Context";
import { FaTrash } from "react-icons/fa";

const CartTotal = () => {
  const { cart, count, clearCart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useContext(Context);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <h2 className="text-center text-xl py-10">
        🛒 Savat bo'sh ({count})
      </h2>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-6">🛒 Savatingizda ({count})</h2>
        <h3
          onClick={clearCart}
          className="text-red-500 font-bold cursor-pointer"
        >
          Barchasini o'chirish
        </h3>
      </div>

      <div className="grid gap-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white shadow p-4 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.title} className="w-20 h-20" />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-blue-600 font-bold">
                  {item.price.toLocaleString()} so'm × {item.quantity}
                </p>
              </div>
            </div>

            {/* Quantity control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseQuantity(item.id)}
                className="px-3 py-1 bg-gray-200 rounded-lg"
              >
                –
              </button>
              <span className="font-bold">{item.quantity}</span>
              <button
                onClick={() => increaseQuantity(item.id)}
                className="px-3 py-1 bg-gray-200 rounded-lg"
              >
                +
              </button>
            </div>

            {/* Narx va o‘chirish */}
            <div className="flex items-center gap-4">
              <p className="font-bold">
                {(item.price * item.quantity).toLocaleString()} so'm
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Umumiy narx */}
      <div className="mt-8 text-right">
        <h3 className="text-xl font-bold">
          Jami: {total.toLocaleString()} so'm
        </h3>

        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
          Buyurtma berish
        </button>
      </div>
    </section>
  );
};

export default CartTotal;
