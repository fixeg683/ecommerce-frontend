import React, { useEffect, useState } from "react";

import API from "../api/axios";
import DownloadButton from "../components/DownloadButton";
import { getProductImageFallback, handleImageFallback, resolveProductImage } from "../utils/productImage";

const Downloads = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("downloads/");
      setProducts(response.data.products || []);
    } catch (fetchError) {
      console.error(fetchError);
      setError(
        "Unable to load downloads. Please refresh or try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Downloads</h1>

      {loading ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-600 mb-4">Loading your downloads…</p>
          <div className="mx-auto h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchDownloads}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-gray-700 mb-3">No downloads available yet.</p>
          <p className="text-sm text-gray-500">
            Your purchases will appear here once payment is confirmed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <img
                src={resolveProductImage(product) || getProductImageFallback()}
                alt={product.name}
                className="w-full h-48 object-cover rounded"
                onError={handleImageFallback}
              />

              <h2 className="text-xl font-bold mt-3">{product.name}</h2>

              <div className="mt-4">
                <DownloadButton product={product} paid={true} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;
