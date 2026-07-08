import { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { sendMessage as sendChatMessage } from '../services/chatService';

export function useChatSocket() {
  const { sessionId, setMessages } = useChat();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const wsHost = host.replace(/^https?:\/\//, '');
    const socket = new WebSocket(`${protocol}://${wsHost}/ws/chatbot/${sessionId}/`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        setMessages((prev) => {
          const newMessages = [...prev];
          
          if (payload.type === 'error') {
            newMessages.push({ role: 'assistant', content: payload.error, id: Date.now() });
            return newMessages;
          }

          if (payload.type === 'message') {
            newMessages.push({ role: 'assistant', content: payload.content, id: Date.now() });
            return newMessages;
          }

          if (payload.type === 'products') {
            newMessages.push({ role: 'assistant', products: payload.products, id: Date.now() });
            return newMessages;
          }

          if (payload.type === 'content') {
            // Find the last assistant message that is still streaming
            const lastMsgIndex = newMessages.length - 1;
            const lastMsg = newMessages[lastMsgIndex];

            if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.products && lastMsg.isStreaming !== false) {
              // Append to existing
              newMessages[lastMsgIndex] = {
                ...lastMsg,
                content: (lastMsg.content || '') + payload.content
              };
            } else {
              // Create new streaming message
              newMessages.push({
                role: 'assistant',
                content: payload.content,
                isStreaming: true,
                id: Date.now()
              });
            }
            return newMessages;
          }

          return newMessages;
        });
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [sessionId, setMessages]);

  const sendMessage = async (text) => {
    if (!sessionId) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    // Mark all previous assistant messages as finished streaming
    setMessages(prev => prev.map(m => (m.role === 'assistant' ? { ...m, isStreaming: false } : m)));

    const userMessage = { role: 'user', content: trimmed, id: Date.now() };
    setMessages(prev => [...prev, userMessage]);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: trimmed }));
    } else {
      try {
        const response = await sendChatMessage(sessionId, trimmed);
        if (response?.message) {
          setMessages(prev => [...prev, { ...response.message, id: Date.now(), isStreaming: false }]);
        }
      } catch (err) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Network error", id: Date.now() }]);
      }
    }
  };

  return { sendMessage };
}
