"use client";
import { useState } from "react";
import { Trash2, ShoppingCart } from "lucide-react";


interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const addToCart = (item: WishlistItem) => {
    // Add to cart logic
    console.log("Added to cart:", item);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="font-semibold mt-2">{item.name}</h3>
              <p className="text-lg font-bold">${item.price}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => addToCart(item)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-600 text-white p-2 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
