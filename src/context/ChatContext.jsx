import { createContext, useContext, useMemo, useState } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const openChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const closeChat = () => setIsOpen(false);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    if (!isOpen) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setSessionId(null);
    setUnreadCount(0);
  };

  const value = useMemo(
    () => ({
      isOpen,
      openChat,
      closeChat,
      sessionId,
      setSessionId,
      messages,
      setMessages,
      addMessage,
      unreadCount,
      resetChat,
    }),
    [isOpen, sessionId, messages, unreadCount]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
