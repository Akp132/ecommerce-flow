// app/product/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  inventory: number;
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:4000/api/products`)
      .then((res) => res.json())
      .then((data: Product[]) => {
        const found = data.find((p) => p.id === Number(id));
        setProduct(found || null);
      });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 hover:underline mb-4"
      >
        ← Back to catalog
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={`https://picsum.photos/seed/${product.id}/500/400`}
          alt={product.title}
          className="w-full h-80 object-cover rounded"
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-blue-700 mb-6">${product.price.toFixed(2)}</p>

          <label className="block mb-2 font-medium text-sm text-gray-700">Quantity</label>
          <input
            type="number"
            min={1}
            max={product.inventory}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-24 mb-4"
          />

          <button
            onClick={() =>
              router.push(`/checkout?pid=${product.id}&qty=${quantity}`)
            }
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
