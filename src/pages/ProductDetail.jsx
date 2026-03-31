import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`products/${id}/`).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-10 flex flex-col md:flex-row gap-10">
      <img src={product.image} className="w-full md:w-1/2 rounded-lg shadow-lg" alt="" />
      <div>
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-2xl text-green-600 my-4">KES {product.price}</p>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <button onClick={() => addToCart(product)} className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800">
          Add to Shopping Bag
        </button>
      </div>
    </div>
  );
};
export default ProductDetail;