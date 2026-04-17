import React, { useEffect, useState } from "react";
import axios from "axios";
import { showError, showSuccess } from "../utils/toast";

const Downloads = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch purchased products
  const fetchDownloads = async () => {
    try {
      const res = await axios.get("/api/orders/my-orders/"); 
      // 👉 Backend should return user's orders with product info

      setProducts(res.data);
    } catch (err) {
      showError("Failed to load downloads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  // Handle download
  const handleDownload = async (productId) => {
    try {
      showSuccess("Starting download...");
      window.open(`/api/payments/download/${productId}/`);
    } catch (err) {
      showError("Download failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading your downloads...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        You have not purchased any products yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Downloads</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((order) => {
          const product = order.product;

          return (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-4 border"
            >
              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg"
              />

              {/* Info */}
              <h2 className="text-lg font-semibold mt-3">
                {product.name}
              </h2>

              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {product.description}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-green-600 font-bold">
                  ${product.price}
                </span>

                {/* Status Badge */}
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    order.is_paid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {order.is_paid ? "Unlocked" : "Locked"}
                </span>
              </div>

              {/* Download Button */}
              <button
                disabled={!order.is_paid}
                onClick={() => handleDownload(product.id)}
                className={`w-full mt-4 py-2 rounded-lg font-medium transition ${
                  order.is_paid
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {order.is_paid ? "Download" : "Purchase Required"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Downloads;