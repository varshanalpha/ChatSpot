import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("chatspot_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("chatspot_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Could not save cart", e);
    }
  }, [cartItems]);

  const addToCart = (item, quantity = 1) => {
    if (item.availability === "SOLD_OUT") return;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { item, quantity }];
    });
  };

  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.item.id === itemId ? { ...i, quantity: newQty } : i))
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (acc, cur) => acc + cur.item.price * cur.quantity,
    0
  );

  const totalItemsCount = cartItems.reduce((acc, cur) => acc + cur.quantity, 0);

  // Dynamic estimated preparation time
  const maxPrepTime = cartItems.length > 0 
    ? Math.max(...cartItems.map((c) => c.item.preparation_time || 10))
    : 10;
  const estimatedPrepMinutes = totalItemsCount > 0 ? Math.min(25, maxPrepTime + Math.floor(totalItemsCount * 1.5)) : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        totalItemsCount,
        estimatedPrepMinutes,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
