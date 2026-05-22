import React from "react";
import { Download, Lock } from "lucide-react";
import toast from "react-hot-toast";

const DownloadButton = ({ product, paid }) => {
  const handleDownload = () => {
    if (!paid) {
      toast.error("Complete payment to unlock downloads");
      return;
    }

    toast.success("Download unlocked");

    window.open(product.digital_file, "_blank");
  };

  return (
    <button
      onClick={handleDownload}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        paid
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-gray-600 text-white"
      }`}
    >
      {paid ? <Download size={18} /> : <Lock size={18} />}
      {paid ? "Download Now" : "Locked"}
    </button>
  );
};

export default DownloadButton;