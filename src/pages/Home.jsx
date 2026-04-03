import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch, Loader2, AlertTriangle } from 'lucide-react';
import api from '../api/axios'; // Custom Axios instance with interceptors

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Robust endpoint with leading slash
    api.get('/products/')
      .then(res => setProducts(res.data))
      .catch((err) => {
        console.error("API Error:", err);
        setError('Failed to load products. Our backend might be warming up (Render cold boot). Please refresh in a minute.');
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
        <Loader2 className="animate-spin text-green-600" size={48} />
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-red-600 bg-red-50 border border-red-200 rounded-2xl max-w-2xl mx-auto px-8 text-center">
        <AlertTriangle className="text-red-500" size={48} />
        <p className="text-xl font-semibold">Connection Error</p>
        <p className="text-gray-700">{error}</p>
        <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition"
        >
            Try Again
          </button>
      </div>
    );
  }

  // --- Main Product Grid ---
  return (
    <div>
      <div className="mb-10 pb-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Explore Products</h1>
        <p className="text-sm text-gray-500">{products.length} Items Found</p>
      </div>
      
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <PackageSearch size={64} className="text-gray-300" />
          <p className="text-xl font-medium">No products available.</p>
          <p className="text-gray-400">Check back later or add some in the admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 p-5 flex flex-col group"
            >
              {/* --- Improved Image Handling with Fallback --- */}
              <div className="w-full h-52 object-cover rounded-xl mb-4 overflow-hidden bg-gray-100">
                <img
                  src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error'; }}
                />
              </div>

              {/* --- Product Info --- */}
              <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">{product.name}</h2>
              <p className="text-gray-500 text-sm flex-grow line-clamp-2 mt-1 mb-3">{product.description}</p>
              
              {/* --- Robust Price Formatting --- */}
              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-gray-500 text-xs">Price</span>
                  <p className="text-green-600 font-extrabold text-xl">
                    KES {Number(product.price).toLocaleString()}
                  </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;