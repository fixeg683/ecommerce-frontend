import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('products/')
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading products...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Explore Products</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-gray-500 text-sm flex-grow">{product.description}</p>
              <p className="text-green-600 font-bold mt-2">KES {product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;