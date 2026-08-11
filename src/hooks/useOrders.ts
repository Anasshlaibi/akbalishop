import { useState, useEffect } from 'react';
import { Order, OrderStatus, CreateOrderPayload, Product } from '../types';
import { orderService } from '../services/orderService';

export function useOrders(catalogProducts?: Product[]) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('useOrders fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
    const created = await orderService.createOrder(payload, catalogProducts);
    setOrders(prev => [created, ...prev]);
    return created;
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    await orderService.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
  };

  return {
    orders,
    isLoading,
    createOrder,
    updateOrderStatus,
    refreshOrders: fetchOrders
  };
}
