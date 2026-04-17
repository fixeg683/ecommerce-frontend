import axios from "axios";

const API = "/api/payments/";

export const verifyPayment = (paymentId, orderId) => {
  return axios.post(`${API}verify-payment/`, {
    payment_id: paymentId,
    order_id: orderId,
  });
};

export const checkAccess = (productId) => {
  return axios.get(`${API}check-access/${productId}/`);
};

export const downloadProduct = (productId) => {
  window.open(`${API}download/${productId}/`);
};