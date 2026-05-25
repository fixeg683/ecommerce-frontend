import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../api/axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const orderId = searchParams.get("order_id");

      if (!orderId) {
        toast.error("Missing order ID");
        setLoading(false);
        return;
      }

      const response = await API.post("payment/verify/", {
        order_id: orderId,
      });

      if (response.data.success) {
        toast.success("Payment successful! Downloads unlocked.");

        localStorage.setItem(
          "downloads_unlocked",
          "true"
        );

        setTimeout(() => {
          navigate("/downloads");
        }, 2000);
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      console.log("FULL ERROR:", error);
      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);
      } else {
        console.log(error.message);
      }

      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (
        <h1 className="text-2xl font-bold">
          Verifying payment...
        </h1>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-600">
            Payment Successful
          </h1>

          <p className="mt-4">
            Your downloads have been unlocked.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;