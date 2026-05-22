import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const orderId = searchParams.get("order_id");

      const res = await axios.post("/payment/verify/", {
        order_id: orderId,
      });

      if (res.data.success) {
        toast.success("Payment successful! Downloads unlocked.");

        localStorage.setItem("downloads_unlocked", "true");

        setTimeout(() => {
          navigate("/downloads");
        }, 2000);
      } else {
        toast.error("Payment verification failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      {loading ? (
        <h1 className="text-2xl font-bold">Verifying Payment...</h1>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-600">
            Payment Successful
          </h1>

          <p className="mt-4 text-lg">
            Your downloads have been unlocked.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;