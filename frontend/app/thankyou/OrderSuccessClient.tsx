'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderSuccessClient() {
  const params = useSearchParams();
  const orderNumber = params.get("o")!;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderNumber) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order/${orderNumber}`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error("Failed to fetch order", err));
  }, [orderNumber]);

  if (!order) return <p className="text-center py-20">Loading…</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold">Thank you!</h1>
      <p className="mt-2">
        Your order <strong>{order.orderNumber}</strong> is {order.status}.
      </p>

      <h2 className="font-semibold mt-6 mb-2">Items</h2>
      <ul className="list-disc list-inside">
        {order.items.map((it: any) => (
          <li key={it.id}>
            {it.product.title} × {it.quantity} – ₹
            {it.subtotal.toFixed(2)}
          </li>
        ))}
      </ul>

      <h2 className="font-semibold mt-6 mb-2">Shipping info</h2>
      <pre className="whitespace-pre-wrap">
{order.customerName}
{order.address}
{order.city}, {order.state} {order.zip}
Phone: {order.phone}
Email: {order.email}
      </pre>
    </div>
  );
}
