import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageSearch, Loader2, AlertTriangle, Monitor, Gamepad2, Film } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORY_ICONS = {
  Softwares: Monitor,
  Games: Gamepad2,
  Movies: Film,
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    api.get('/products/')
      .then(res => setProducts(res.data))
      .catch((err) => {
        console.error('API Error:', err);
        setError('Failed to load products. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p =>
        p.category_name?.toLowerCase() === activeCategory.toLowerCase()
      );

  const CategoryIcon = CATEGORY_ICONS[activeCategory];

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
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-red-50 border border-red-200 rounded-2xl px-10 py-12 text-center max-w-lg w-full">
          <AlertTriangle className="text-red-400 mx-auto mb-4" size={52} />
          <p className="text-xl font-bold text-red-600 mb-2">Connection Error</p>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button onClick={fetchProducts} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {CategoryIcon && <CategoryIcon size={28} className="text-green-600" />}
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              {activeCategory === 'All' ? 'Explore Products' : activeCategory}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {activeCategory === 'All' ? 'Discover the best deals on E-Space' : `Browsing ${activeCategory.toLowerCase()}`}
            </p>
          </div>
        </div>
        <span className="bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full border border-green-100">
          {filtered.length} {filtered.length === 1 ? 'Item' : 'Items'} Found
        </span>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['All', 'Softwares', 'Games', 'Movies'].map((cat) => {
          const Icon = CATEGORY_ICONS[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => cat === 'All' ? setSearchParams({}) : setSearchParams({ category: cat })}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                isActive
                  ? 'bg-green-600 text-white border-green-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600'
              }`}
            >
              {Icon && <Icon size={14} />}
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid — full width, responsive columns */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
          <PackageSearch size={72} className="text-gray-200" />
          <p className="text-xl font-semibold text-gray-400">
            No {activeCategory === 'All' ? 'products' : activeCategory.toLowerCase()} available
          </p>
          <p className="text-gray-300 text-sm">Check back later or add some in the admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;