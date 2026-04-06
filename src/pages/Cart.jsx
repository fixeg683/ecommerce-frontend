// Replace the handleCheckout function in Cart.jsx with this:
const handleCheckout = async () => {
  const cleaned = phone.replace(/\s+/g, '');
  if (!cleaned.startsWith('254') || cleaned.length !== 12) {
    setMessage('Enter a valid Safaricom number starting with 254 (e.g. 254712345678)');
    setMessageType('error');
    return;
  }

  setPaying(true);
  setMessage('📱 Sending STK push to your phone...');
  setMessageType('success');

  try {
    const productIds = cart.map(i => i.id);
    const paidItems = [...cart];

    const res = await api.post('/pay/', {
      phone: cleaned,
      amount: totalPrice,
      product_ids: productIds,
    });

    markProductsAsPaid(productIds);
    setPaidOrder(paidItems);
    clearCart();
    setMessage('✅ Payment successful! Your downloads are ready below.');
    setMessageType('success');
  } catch (err) {
    const detail =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      'Payment failed. Please check your number and try again.';
    setMessage(detail);
    setMessageType('error');
  } finally {
    setPaying(false);
  }
};