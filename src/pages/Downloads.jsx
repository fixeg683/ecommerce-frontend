import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { showSuccess, showError } from '../utils/toast';

const Downloads = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  const fetchDownloads = async () => {
    try {
      // Returns [{ order_id, is_paid, product: { id, name, description, price, image } }]
      const res = await api.get('/orders/my-orders/');
      setOrders(res.data);
    } catch (err) {
      showError('Failed to load your downloads. Please refresh.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const handleDownload = async (productId, productName) => {
    setDownloading(productId);
    try {
      // GET /api/download/{id}/ → { download_url: "https://cloudinary..." }
      const res = await api.get(`/download/${productId}/`);
      const url = res.data?.download_url;

      if (!url) {
        showError('No file found for this product. Contact support.');
        return;
      }

      window.open(url, '_blank');
      showSuccess(`⬇️ Downloading "${productName}"…`);

    } catch (err) {
      if (err.response?.status === 403) {
        showError('Purchase required to download this product.');
      } else if (err.response?.status === 404) {
        showError('File not available yet. Contact support.');
      } else {
        showError('Download failed. Please try again.');
      }
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <p>Loading your downloads…</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-4xl mb-4">📦</p>
        <p className="text-lg font-medium">No purchases yet.</p>
        <p className="text-sm mt-1">Buy a product and it will appear here ready to download.</p>
        <a
          href="/"
          className="mt-5 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">My Downloads</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order, index) => {
          const product = order.product;
          const isUnlocked = order.is_paid;
          const isDownloading = downloading === product.id;

          return (
            <div
              key={`${order.order_id}-${product.id}-${index}`}
              className="bg-white rounded-xl shadow-md p-4 border flex flex-col"
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  className={`w-full h-40 object-cover rounded-lg transition ${!isUnlocked ? 'opacity-40 grayscale' : ''}`}
                />
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">🔒</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <h2 className="text-lg font-semibold mt-3">{product.name}</h2>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2 flex-grow">
                {product.description}
              </p>

              {/* Price + Status */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-green-600 font-bold">
                  KES {Number(product.price).toLocaleString()}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  isUnlocked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {isUnlocked ? '✅ Unlocked' : '🔒 Locked'}
                </span>
              </div>

              {/* Download Button */}
              <button
                disabled={!isUnlocked || isDownloading}
                onClick={() => handleDownload(product.id, product.name)}
                className={`w-full mt-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  isUnlocked
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Preparing…
                  </>
                ) : isUnlocked ? '⬇️ Download' : 'Purchase Required'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Downloads;
