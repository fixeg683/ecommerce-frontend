import { useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { totalPrice, cartItems } = useCart();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const cleanPhone = phone
        .replace(/^0/, "254")
        .replace(/\+/g, "");

      const payload = {
        phone_number: cleanPhone,
        amount: Number(totalPrice),
        product_ids: cartItems.map(i => i.id),
      };

      console.log("PAYLOAD:", payload);

      const { data } = await API.post("create-order/", payload);
      console.log("[PAY] Response:", data);

      const checkoutRequestId = data.CheckoutRequestID;
      let confirmed = false;

      // Poll every 5 seconds, up to 12 times (1 minute)
      for (let i = 0; i < 12; i++) {
        await new Promise(r => setTimeout(r, 5000));

        const { data: vData } = await API.post("payment/verify/", {
          checkout_request_id: checkoutRequestId,
        });

        console.log("[POLL] Verify result:", vData);

        if (vData.success && vData.confirmed) {
          confirmed = true;
          break;
        }
      }

      if (!confirmed) {
        toast.error("Payment not confirmed within 60s. Contact support if charged.");
        return;
      }

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

    } catch (error) {
      console.log("FULL ERROR:", error);
      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("DATA:", error.response.data);
      } else {
        console.log(error.message);
      }

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

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Safaricom Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="254712345678"
          className="w-full px-4 py-3 border rounded"
        />
      </div>

      <div className="mb-6 text-sm text-gray-600">
        Use format <strong>254712345678</strong>. Do not include leading 0 or +.
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || !phone.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

    </div>
  );
};

export default Checkout;