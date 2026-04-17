import React, { useEffect, useState } from "react";
import axios from "axios";
import { showError, showSuccess } from "../utils/toast";

const Downloads = () => {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

// Fetch purchased products
const fetchDownloads = async () => {
try {
const res = await axios.get("/api/orders/my-orders/");
setProducts(res.data);
} catch (err) {
console.error(err);
showError("Failed to load downloads");
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchDownloads();
}, []);

// Handle download
const handleDownload = (productId) => {
try {
showSuccess("Starting download...");
window.open(`/api/download/${productId}/`, "_blank");
} catch (err) {
console.error(err);
showError("Download failed");
}
};

if (loading) {
return ( <div className="text-center py-10 text-gray-500">
Loading your downloads... </div>
);
}

if (!products.length) {
return ( <div className="text-center py-10 text-gray-500">
You have not purchased any products yet. </div>
);
}

return ( <div className="max-w-6xl mx-auto px-4"> <h1 className="text-2xl font-bold mb-6">My Downloads</h1>

```
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((order, index) => {
      const product = order.product;

      return (
        <div
          key={`${order.order_id}-${product.id}-${index}`}
          className="bg-white rounded-xl shadow-md p-4 border"
        >
          {/* Product Image */}
          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            className="w-full h-40 object-cover rounded-lg"
          />

          {/* Product Info */}
          <h2 className="text-lg font-semibold mt-3">
            {product.name}
          </h2>

          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>

          {/* Price + Status */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-green-600 font-bold">
              ${product.price}
            </span>

            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
              Unlocked
            </span>
          </div>

          {/* Download Button */}
          <button
            onClick={() => handleDownload(product.id)}
            className="w-full mt-4 py-2 rounded-lg font-medium transition bg-blue-600 hover:bg-blue-700 text-white"
          >
            Download
          </button>
        </div>
      );
    })}
  </div>
</div>


);
};

export default Downloads;
