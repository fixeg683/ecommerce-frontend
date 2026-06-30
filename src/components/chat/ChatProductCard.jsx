export default function ChatProductCard({ product, onClick }) {
  return (
    <button onClick={onClick} className="w-full rounded-xl border border-gray-200 bg-white p-2 text-left shadow-sm">
      <p className="font-medium text-gray-900">{product.name}</p>
      <p className="text-xs text-gray-500">KES {product.price}</p>
    </button>
  );
}
