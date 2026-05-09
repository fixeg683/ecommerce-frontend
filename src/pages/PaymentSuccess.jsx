import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyPayment } from "../services/paymentService";
import { showSuccess, showError } from "../utils/toast";

const PaymentSuccess = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    const paymentId = params.get("paymentId");
    const orderId = params.get("orderId");

    if (paymentId && orderId) {
      verifyPayment(paymentId, orderId)
        .then(() => {
          showSuccess("🎉 Payment successful! Download unlocked.");
        })
        .catch(() => {
          showError("Payment verification failed");
        });
    }
  }, []);

  return <h2>Processing payment...</h2>;
};

export default PaymentSuccess;
