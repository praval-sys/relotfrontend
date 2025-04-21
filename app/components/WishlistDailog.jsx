"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";

export default function WishlistDailog() {
  const token = useSelector((state) => state.auth.token);
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);


  const deleteFromList = async (itemId) => {
    console.log("Token:", token);
    debugger;
    try {
      const res = await axios.delete(
        `http://localhost:3000/v1/wish/remove/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts((prevProducts) =>
        prevProducts.filter((item) => item.productId !== itemId)
      );
      console.log("Item deleted:", res.data);
    } catch (error) {
      console.log("Cannot delete items");
    }
  };

  const ClearWishList = async () => {
    debugger;
    try {
      const res = await axios.delete("http://localhost:3000/v1/wish/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prevProducts) =>
        prevProducts.filter((item) => item.productId !== itemId)
      );
      console.log("Items deleted:", res.data);
    } catch (error) {
      console.log("Error in ClearWishList", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      debugger;
      try {
        const res = await axios.get(`http://localhost:3000/v1/wish/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }, 
        });
        const items = res.data?.data?.items || [];

        setProducts(items);
        setWishLength(items.length);
        console.log(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    console.log(token);
    fetchProducts();
  }, []);

  return (
    <div className="relative">
      {/* Wishlist Button/Icon */}

      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <Heart className="h-6 w-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
          {Object.keys(products).length}
        </span>
      </button>

      {/* Wishlist Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-12 right-0 z-50 w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Your Wishlist</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 text-xl"
            >
              ❌
            </button>
          </div>

          <div className="text-right mb-2">
            <button
              onClick={() => ClearWishList()}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-3">
            {Object.values(products).length === 0 ? (
              <p className="text-sm text-gray-500">Your wishlist is empty.</p>
            ) : (
              Object.values(products).map((item) => (
                <div
                  key={item.productId}
                  className="border p-3 rounded bg-gray-100 flex items-start gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-600">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteFromList(item.productId)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
