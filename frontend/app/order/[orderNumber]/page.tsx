"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/order/${orderNumber}`)
      .then((res) => {
        if (!res.ok) throw new Error("Order not found");
        return res.json();
      })
      .then(setOrder)
      .catch((err) => setError(err.message));
  }, [orderNumber]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">
        Loading order...
      </div>
    );
  }

  const total = order.items.reduce(
    (sum: number, item: any) => sum + item.subtotal,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          ✅ Order {order.orderNumber} Confirmed
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you {order.customerName}, we&apos;ve emailed your receipt to {order.email}.
        </p>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <ul className="divide-y">
            {order.items.map((item: any) => (
              <li key={item.id} className="py-2 flex justify-between">
                <span>
                  {item.product.title}
                  <span className="text-sm text-gray-500 ml-2">Qty: {item.quantity}</span>
                </span>
                <span className="font-medium text-blue-700">${item.subtotal.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="pt-4 mt-4 border-t text-right text-lg font-bold">
            Total: ${total.toFixed(2)}
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-700">
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Address:</strong> {order.address}, {order.city}, {order.state} - {order.zip}</p>
          <p><strong>Card Ending In:</strong> **** **** **** {order.cardLast4}</p>
        </div>

        {/* 👇 Button to go back to catalog */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
          >
            🔙 Return to Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
