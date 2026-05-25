import API from '../api/axios'; // auth-configured axios instance

/**
 * Initiate M-Pesa STK Push
 */
export const initiatePay = (phone, amount, productIds) => {
  return API.post('create-order/', {
    phone,
    amount,
    product_ids: productIds,
  });
};

/**
 * Poll M-Pesa for payment confirmation
 */
export const verifyPayment = (checkoutRequestId) => {
  return API.post('payment/verify/', {
    checkout_request_id: checkoutRequestId,
  });
};

/**
 * Open the download URL for a purchased product
 */
export const downloadProduct = (productId) => {
  window.open(`/api/download/${productId}/`, '_blank');
};