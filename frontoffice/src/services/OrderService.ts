import { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus, shippingAddress } from "../types/order";
import { axiosInstance } from "./api";

const ORDERS_STORAGE_KEY = 'ecommerce_orders';

export const OrderService = {
  // Create a new order
  createOrder: async (
    userId: number,
    items: OrderItem[],
    shippingAddress: shippingAddress,
    paymentMethod: PaymentMethod
  ): Promise<Order> => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.2; // 20% tax
    const shippingCost = 10; // Flat shipping cost
    const total = subtotal + tax + shippingCost;

    const newOrder: Order = {
      id: generateId(),
       userId,
      orderItems: items,
      status: OrderStatus.PROCESSING,
      shippingAddress,
      paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      subtotal,
      tax,
      shippingCost,
      total_amount: total,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const orders = getOrders();
    orders.push(newOrder);
    saveOrders(orders);

    return newOrder;
  },

  // Get all orders for a user
  async getOrdersByUser(idUser: string): Promise<Order[]> {
    try {
      const response = await axiosInstance.get(`/orders/listerCommandes`, {
        withCredentials: true // Inclure les cookies de session si nécessaires
      });

      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message);
      }

      return response.data.data; // Renvoie les commandes
    } catch (error) {
      throw error;
    }
  },

  // Get a specific order by ID
  getOrderById: async (orderId: string): Promise<Order | null> => {
    const orders = getOrders();
    return orders.find(order => order.id === orderId) || null;
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order | null> => {
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;

    orders[orderIndex] = { 
      ...orders[orderIndex], 
      status, 
      updatedAt: new Date() 
    };
    saveOrders(orders);
    return orders[orderIndex];
  },

  // Update payment status
  updatePaymentStatus: async (orderId: string, paymentStatus: PaymentStatus): Promise<Order | null> => {
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return null;

    orders[orderIndex] = { 
      ...orders[orderIndex], 
      paymentStatus, 
      updatedAt: new Date() 
    };
    saveOrders(orders);
    return orders[orderIndex];
  },

  // Cancel an order (only if it's still processing)
  cancelOrder: async (orderId: string): Promise<boolean> => {
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId && order.status === OrderStatus.PROCESSING);
    if (orderIndex === -1) return false;

    orders[orderIndex] = {
      ...orders[orderIndex],
      status: OrderStatus.CANCELLED,
      updatedAt: new Date()
    };
    saveOrders(orders);
    return true;
  }
};

// Helper functions
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const getOrders = (): Order[] => {
  const ordersJson = localStorage.getItem(ORDERS_STORAGE_KEY);
  return ordersJson ? JSON.parse(ordersJson) : [];
};

const saveOrders = (orders: Order[]): void => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};