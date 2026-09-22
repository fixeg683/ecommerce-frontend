import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageSearch, Loader2, AlertTriangle, Monitor, Gamepad2, Film, BookOpen } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORY_ICONS = {
  Softwares: Monitor,
  Games: Gamepad2,
  Movies: Film,
  'E-Books': BookOpen,
};

const CATEGORIES = ['All', 'Softwares', 'Games', 'Movies', 'E-Books'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const fetchProducts = () => {
    setLoading(true);
    setError(null);

    api.get('products/')
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error('API Error:', err);
        setError('Products are temporarily unavailable. Please try again shortly.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p =>
        p.category_name?.toLowerCase() === activeCategory.toLowerCase()
      );

  const CategoryIcon = CATEGORY_ICONS[activeCategory];

  return (
    <div className="w-full">
      {/* Stable, indexable homepage content. This remains visible even if the product API is temporarily unavailable. */}
      <section className="mb-8 rounded-2xl bg-white border border-gray-100 p-6 sm:p-8 shadow-sm">
        <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">
          Nexusmall Marketplace
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-gray-900">
          Premium Software, Games, Movies & E-Books
        </h1>
        <p className="mt-3 max-w-3xl text-gray-600 leading-7">
          Discover digital products on Nexusmall Marketplace. Browse software,
          games, movies and e-books, explore product details, and securely
          purchase digital products online.
        </p>
      </section>

      {/* Product catalogue */}
      <section aria-labelledby="catalogue-heading">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {CategoryIcon && <CategoryIcon size={28} className="text-green-600" />}
            <div>
              <h2 id="catalogue-heading" className="text-2xl font-black text-gray-900">
                {activeCategory === 'All' ? 'Explore Products' : activeCategory}
              </h2>
              <p className="text-gray-400 text-sm mt-0.5">
                {activeCategory === 'All'
                  ? 'Discover the best deals on Nexusmall'
                  : `Browsing ${activeCategory.toLowerCase()}`}
              </p>
            </div>
          </div>

          {!loading && !error && (
            <span className="bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full border border-green-100">
              {filtered.length} {filtered.length === 1 ? 'Item' : 'Items'} Found
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => cat === 'All'
                  ? setSearchParams({})
                  : setSearchParams({ category: cat })}
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

        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-gray-500">
            <Loader2 className="animate-spin text-green-600" size={56} />
            <p className="text-lg font-medium">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-500 shrink-0" size={24} />
              <div>
                <p className="font-bold text-amber-800">Product catalogue temporarily unavailable</p>
                <p className="text-amber-700 text-sm mt-1">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-lg transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[30vh] gap-4 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            <PackageSearch size={72} className="text-gray-200" />
            <p className="text-xl font-semibold text-gray-400">
              No {activeCategory === 'All' ? 'products' : activeCategory.toLowerCase()} available
            </p>
            <p className="text-gray-300 text-sm">Check back later for new digital products.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
