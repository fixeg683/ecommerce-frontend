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
        setError('Failed to load products. Our backend might be warming up. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-gray-500">
        <Loader2 className="animate-spin text-green-600" size={56} />
        <p className="text-lg font-medium">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl px-10 py-12 text-center max-w-lg w-full">
          <AlertTriangle className="text-red-400 mx-auto mb-4" size={52} />
          <p className="text-xl font-bold text-red-600 mb-2">Connection Error</p>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Explore Products</h1>
          <p className="text-gray-400 text-sm mt-1">Discover the best deals on E-Space</p>
        </div>
        <span className="bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full border border-green-100">
          {products.length} {products.length === 1 ? 'Item' : 'Items'} Found
        </span>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
          <PackageSearch size={72} className="text-gray-200" />
          <p className="text-xl font-semibold text-gray-400">No products available</p>
          <p className="text-gray-300 text-sm">Check back later or add some in the admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;