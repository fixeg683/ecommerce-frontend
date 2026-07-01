import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useChat } from '../context/ChatContext';
import { trackClick, trackView } from '../services/chatService';
import { getProductImageFallback, handleImageFallback, resolveProductImage } from '../utils/productImage';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { sessionId } = useChat();

  useEffect(() => {
    api.get(`products/${id}/`).then((res) => setProduct(res.data));
    trackView(id, sessionId);
  }, [id, sessionId]);

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="container mx-auto flex flex-col gap-10 p-10 md:flex-row">
      <img 
        src={resolveProductImage(product) || getProductImageFallback()} 
        className="w-full rounded-lg shadow-lg md:w-1/2" 
        alt={product.name || ""} 
        onError={handleImageFallback}
      />
      <div className="flex-1">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="my-4 text-2xl text-green-600">KES {product.price}</p>
        <p className="mb-6 text-gray-600">{product.description}</p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              addToCart(product);
              trackClick(id, sessionId);
            }}
            className="rounded-full bg-black px-8 py-3 text-white hover:bg-gray-800"
          >
            Add to Shopping Bag
          </button>
          <button
            onClick={() => window.history.back()}
            className="rounded-full border border-gray-300 px-8 py-3 text-gray-700 hover:bg-gray-100"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
