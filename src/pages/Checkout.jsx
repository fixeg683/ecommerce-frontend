import { useState } from "react";
import { toast } from "react-toastify";
import axios from "../api/axios";

const Checkout = () => {

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {

    try {

      setLoading(true);

      // Create order and initiate payment
      const { data } = await axios.post("create-order/", {
        amount: 1,
      });

      // Verify payment status
      const verify = await axios.post("payment/verify/", {
        checkout_id: data.checkout_id,
      });

      if (verify.data.success) {

        // SAVE PURCHASE STATE
        localStorage.setItem(
          "downloadsUnlocked",
          "true"
        );

        toast.success(
          "Payment successful! Downloads unlocked."
        );

        // redirect
        window.location.href = "/downloads";
      }

    } catch (error) {

      console.log(error);

      toast.error(
        "Payment failed. Try again."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Checkout
      </h1>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

    </div>
  );
};

export default Checkout;