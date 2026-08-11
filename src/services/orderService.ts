import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order, OrderStatus, CreateOrderPayload, Product } from '../types';
import { productService } from './productService';

class OrderService {
  /**
   * Secure Order Creation
   * Fetches authoritative product prices from database/productService to prevent price tampering
   */
  async createOrder(payload: CreateOrderPayload, catalogProducts?: Product[]): Promise<Order> {
    if (!payload.items || payload.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // 1. Fetch authoritative product details for all requested item IDs
    const productsList = catalogProducts && catalogProducts.length > 0
      ? catalogProducts
      : await productService.getProducts();

    const orderItems = payload.items.map(item => {
      if (item.quantity <= 0) {
        throw new Error(`Invalid item quantity for product ${item.id}`);
      }

      const foundProduct = productsList.find(p => p.id === item.id);
      if (!foundProduct) {
        throw new Error(`Product not found: ${item.id}`);
      }

      if (!foundProduct.inStock) {
        throw new Error(`Product ${foundProduct.name} is currently out of stock`);
      }

      // Authoritative Price Calculation: DB price * quantity
      const itemPrice = Number(foundProduct.price);
      return {
        id: foundProduct.id,
        name: foundProduct.name,
        quantity: Math.floor(item.quantity),
        price: itemPrice
      };
    });

    // Subtotal calculated strictly on server/service layer
    const totalAmount = orderItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

    const newOrder: Order = {
      id: `AK-${Date.now().toString().slice(-6)}`,
      orderNumber: `AK-${Date.now().toString().slice(-6)}`,
      customerName: payload.customerName.trim(),
      customerPhone: payload.customerPhone.trim(),
      city: payload.city.trim(),
      address: payload.address.trim(),
      paymentMethod: payload.paymentMethod,
      totalAmount,
      items: orderItems,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('orders').insert([{
          id: newOrder.id,
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          city: newOrder.city,
          address: newOrder.address,
          payment_method: newOrder.paymentMethod,
          total_amount: newOrder.totalAmount,
          items: newOrder.items,
          status: newOrder.status,
          created_at: newOrder.createdAt
        }]);
        if (error) {
          console.error('orderService.createOrder database warning:', error);
        }
      } catch (err) {
        console.error('orderService.createOrder exception:', err);
      }
    }

    return newOrder;
  }

  /**
   * Fetch all orders
   */
  async getOrders(): Promise<Order[]> {
    if (!isSupabaseConfigured || !supabase) {
      const saved = localStorage.getItem('akabli_orders');
      return saved ? JSON.parse(saved) : [];
    }

    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error || !data) {
        const saved = localStorage.getItem('akabli_orders');
        return saved ? JSON.parse(saved) : [];
      }

      return data.map((row: any) => ({
        id: row.id,
        orderNumber: row.id,
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        city: row.city,
        address: row.address,
        paymentMethod: row.payment_method,
        totalAmount: Number(row.total_amount),
        items: Array.isArray(row.items) ? row.items : [],
        status: row.status || 'pending',
        createdAt: row.created_at
      }));
    } catch {
      const saved = localStorage.getItem('akabli_orders');
      return saved ? JSON.parse(saved) : [];
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) {
        console.error('orderService.updateOrderStatus error:', error);
        return false;
      }
    }
    return true;
  }
}

export const orderService = new OrderService();
