"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  inventory: number;
};

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden pb-20 px-6">
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-12 text-center text-blue-700">
          🛍️ e-SalesOne Catalog
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product) => {
            const isOutOfStock = product.inventory === 0;

            return (
              <div
                key={product.id}
                className={`relative block rounded-xl shadow p-4 transition duration-200 ${
                  isOutOfStock
                    ? "bg-gray-200 cursor-not-allowed opacity-60"
                    : "bg-white hover:shadow-lg"
                }`}
              >
                {/* Product Image */}
                <div className="w-full h-48 overflow-hidden rounded mb-4">
                  <img
                    src={`https://picsum.photos/seed/${product.id}/400/300`}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Out of Stock Label */}
                {isOutOfStock && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}

                {/* Title - Clickable only if in stock */}
                {!isOutOfStock ? (
                  <Link href={`/product/${product.id}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-1 hover:underline">
                      {product.title}
                    </h2>
                  </Link>
                ) : (
                  <h2 className="text-xl font-bold text-gray-500 mb-1">{product.title}</h2>
                )}

                <p className="text-gray-600 text-sm mb-2">
                  {product.description}
                </p>
                <p className="text-lg font-semibold text-blue-600">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
