

export interface Order {
  id: string;
  userId: number;
  orderItems: OrderItem[];
  status: OrderStatus;
  shippingAddress: shippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total_amount: number;
  createdAt: Date;
  updatedAt: Date;
}



export interface OrderItem {
  product : Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface Product {
  id: number;
  nameProduct: string;
  description: string;
  price: number;
  createdate: string;
  updatedate: string | null;
}

export enum OrderStatus {
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface shippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export enum PaymentMethod {
  CARD = 'card',
  CASH = 'cash',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}