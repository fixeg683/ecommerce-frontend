import api from '../api/axios';

export const createSession = async () => {
  const response = await api.post('/chatbot/sessions/');
  return response.data;
};

export const fetchHistory = async (sessionId) => {
  const response = await api.get(`/chatbot/sessions/${sessionId}/`);
  return response.data;
};

export const sendMessage = async (sessionId, message) => {
  const response = await api.post(`/chatbot/sessions/${sessionId}/messages/`, { message });
  return response.data;
};

export const submitLead = async (payload) => {
  const response = await api.post('/chatbot/leads/', payload);
  return response.data;
};

export const trackView = async (productId, sessionId = null) => {
  const payload = { product_id: productId };
  if (sessionId) payload.session_id = sessionId;
  const response = await api.post('/chatbot/track-view/', payload);
  return response.data;
};

export const trackClick = async (productId, sessionId = null) => {
  const payload = { product_id: productId };
  if (sessionId) payload.session_id = sessionId;
  const response = await api.post('/chatbot/track-click/', payload);
  return response.data;
};
