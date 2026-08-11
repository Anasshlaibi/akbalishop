export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'bank' | 'pickup';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber?: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  paymentMethod: PaymentMethod | string;
  totalAmount: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  paymentMethod: PaymentMethod | string;
  items: Array<{
    id: string;
    quantity: number;
  }>;
}
