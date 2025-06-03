'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Order = {
  orderNumber: string;
  email: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
};

export default function SuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return;

      try {
        const res = await fetch(`http://localhost:4000/api/orders/${orderNumber}`);
        if (!res.ok) throw new Error('Order not found');
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) return <div className="text-center py-20">Loading order details...</div>;

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">Order not found</h2>
        <p className="mt-4 text-gray-600">Please check your order number or try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Order Successful!</h1>
      <p className="text-lg text-gray-700">Thank you for your purchase, <strong>{order.email}</strong></p>
      <p className="text-md text-gray-500 mb-6">Order Number: {order.orderNumber}</p>

      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <ul className="divide-y divide-gray-200">
          {order.items.map((item, index) => (
            <li key={index} className="py-2 flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold">₹{item.price * item.quantity}</p>
            </li>
          ))}
        </ul>
        <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>₹{order.total}</span>
        </div>
      </div>
    </div>
  );
}
