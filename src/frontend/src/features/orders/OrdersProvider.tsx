import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from './types';
import { loadOrders, saveOrders, clearOrders } from './storage';

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  deleteOrder: (id: string) => void;
  toggleCompleted: (id: string) => void;
  clearAllOrders: () => void;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    setOrders((prev) => [...prev, newOrder]);
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const toggleCompleted = (id: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, completed: !order.completed } : order
      )
    );
  };

  const clearAllOrders = () => {
    setOrders([]);
    clearOrders();
  };

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, deleteOrder, toggleCompleted, clearAllOrders }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
}
