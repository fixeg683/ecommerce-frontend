import { useEffect, useState } from "react";
import { checkAccess, downloadProduct } from "../services/paymentService";

const DownloadButton = ({ productId }) => {
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    checkAccess(productId).then((res) => {
      setIsPaid(res.data.is_paid);
    });
  }, [productId]);

  return (
    <button
      disabled={!isPaid}
      onClick={() => downloadProduct(productId)}
    >
      {isPaid ? "Download File" : "Buy to Unlock"}
    </button>
  );
};

export default DownloadButton;