"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pid = Number(searchParams.get("pid"));
  const qty = Number(searchParams.get("qty") || "1");

  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p: Product) => p.id === pid);
        setProduct(found);
      });
  }, [pid]);

  const handleSubmit = async () => {
    if (!product) return;

    const res = await fetch("http://localhost:4000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
        },
        cart: [
          {
            productId: product.id,
            quantity: qty,
            variant: "default",
          },
        ],
        payment: {
          cardNumber: form.cardNumber,
          expiry: form.expiry,
          cvv: form.cvv,
        },
      }),
    });

    const data = await res.json();
    if (data.orderNumber) {
      router.push(`/order/${data.orderNumber}`);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Full Name" onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })} className="border p-2 rounded" />
          <input placeholder="City" onChange={(e) => setForm({ ...form, city: e.target.value })} className="border p-2 rounded" />
          <input placeholder="State" onChange={(e) => setForm({ ...form, state: e.target.value })} className="border p-2 rounded" />
          <input placeholder="ZIP" onChange={(e) => setForm({ ...form, zip: e.target.value })} className="border p-2 rounded" />
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">Payment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input placeholder="Card number" onChange={(e) => setForm({ ...form, cardNumber: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Expiry MM/YY" onChange={(e) => setForm({ ...form, expiry: e.target.value })} className="border p-2 rounded" />
          <input placeholder="CVV" onChange={(e) => setForm({ ...form, cvv: e.target.value })} className="border p-2 rounded" />
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-1">Order Summary</h3>
          <p className="mb-1">{product.title}</p>
          <p className="text-sm text-gray-500">Qty: {qty}</p>
          <p className="text-xl font-bold text-blue-600">Total: ${(product.price * qty).toFixed(2)}</p>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Pay ${product.price * qty}
        </button>
      </div>
    </div>
  );
}
