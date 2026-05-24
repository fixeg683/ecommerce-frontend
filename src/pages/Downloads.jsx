import React, { useEffect, useState } from "react";

import API from "../api/axios";
import DownloadButton from "../components/DownloadButton";

const Downloads = () => {
  const [products, setProducts] = useState([]);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await API.get("downloads/");

      setProducts(response.data.products || []);
      setPaid(response.data.paid || false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Downloads
      </h1>

      {products.length === 0 ? (
        <p>No downloads available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded"
              />

              <h2 className="text-xl font-bold mt-3">
                {product.name}
              </h2>

              <div className="mt-4">
                <DownloadButton
                  product={product}
                  paid={paid}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;