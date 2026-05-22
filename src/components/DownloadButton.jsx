import React from "react";
import toast from "react-hot-toast";

const DownloadButton = ({ product, paid }) => {
  const handleDownload = () => {
    if (!paid) {
      toast.error(
        "Complete payment to unlock downloads"
      );
      return;
    }

    if (!product?.digital_file) {
      toast.error("Download file not available");
      return;
    }

    toast.success("Download started");

    window.open(product.digital_file, "_blank");
  };

  return (
    <button
      onClick={handleDownload}
      className={`px-4 py-2 rounded text-white ${
        paid
          ? "bg-green-600"
          : "bg-gray-500"
      }`}
    >
      {paid ? "Download" : "Locked"}
    </button>
  );
};

export default DownloadButton;