import { toast } from "react-toastify";

const DownloadButton = ({ fileUrl }) => {

  const unlocked =
    localStorage.getItem("downloadsUnlocked");

  const handleDownload = () => {

    if (!unlocked) {

      toast.error(
        "Purchase required to download."
      );

      return;
    }

    toast.success("Download started");

    window.open(fileUrl, "_blank");
  };

  return (

    <button
      onClick={handleDownload}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Download File
    </button>
  );
};

export default DownloadButton;