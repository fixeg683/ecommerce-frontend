import { useEffect, useState } from 'react';
import { PackageSearch, Loader2, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    api.get('/products/')
      .then(res => setProducts(res.data))
      .catch((err) => {
        console.error("API Error:", err);
        setError('Failed to load products. Our backend might be warming up (Render cold boot). Please refresh in a minute.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
        <Loader2 className="animate-spin text-green-600" size={48} />
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-red-600 bg-red-50 border border-red-200 rounded-2xl max-w-2xl mx-auto px-8 text-center">
        <AlertTriangle className="text-red-500" size={48} />
        <p className="text-xl font-semibold">Connection Error</p>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Products
  return (
    <div>
      {/* Header */}
      <div className="mb-10 pb-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Explore Products</h1>
        <p className="text-sm text-gray-500">{products.length} Items Found</p>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <PackageSearch size={64} className="text-gray-300" />
          <p className="text-xl font-medium">No products available.</p>
          <p className="text-gray-400">Check back later or add some in the admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;