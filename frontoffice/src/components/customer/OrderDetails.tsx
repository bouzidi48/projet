import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { OrderService } from '../../services/OrderService';
import { Order, OrderStatus } from '../../types/order';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (orderId) {
          const fetchedOrder = await OrderService.getOrderById(orderId);
          setOrder(fetchedOrder);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (order && order.status === OrderStatus.Pending) {
      try {
        const success = await OrderService.cancelOrder(order.id);
        if (success) {
          setOrder({ ...order, status: OrderStatus.Cancelled });
        } else {
          setError('Failed to cancel the order');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while cancelling the order');
      }
    }
  };

  if (isLoading) return <div className="text-center">Loading order details...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!order) return <div className="text-center">Order not found</div>;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Order #{order.id}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.status}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${order.total.toFixed(2)}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {`${order.shippingAddress.street1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Order Items</h3>
        <ul className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <li key={item.productId} className="py-4 flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">${item.totalPrice.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>
      {order.status === OrderStatus.Pending && (
        <button
          onClick={handleCancelOrder}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
};

export default OrderDetails;