
Action: file_editor create /app/frontend/src/context/CartContext.jsx --file-text "import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('mr_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('mr_cart', JSON.stringify(items));
  }, [items]);

  const add = (menuItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.item_id === menuItem.id);
      if (existing) {
        return prev.map((p) => p.item_id === menuItem.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { item_id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1, image_url: menuItem.image_url }];
    });
  };

  const updateQty = (itemId, qty) => {
    if (qty <= 0) return remove(itemId);
    setItems((prev) => prev.map((p) => p.item_id === itemId ? { ...p, quantity: qty } : p));
  };

  const remove = (itemId) => setItems((prev) => prev.filter((p) => p.item_id !== itemId));
  const clear = () => setItems([]);

  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  const count = items.reduce((s, it) => s + it.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, updateQty, remove, clear, subtotal, tax, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
"
Observation: Create successful: /app/frontend/src/context/CartContext.jsx