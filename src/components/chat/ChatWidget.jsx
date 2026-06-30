import { MessageCircle, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import ChatPanel from './ChatPanel';

export default function ChatWidget() {
  const { isOpen, openChat, closeChat, unreadCount } = useChat();

  return (
    <>
      <button
        onClick={() => (isOpen ? closeChat() : openChat())}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105"
        aria-label="Open chat"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
      {unreadCount > 0 && !isOpen && (
        <div className="fixed bottom-20 right-6 z-50 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
          {unreadCount}
        </div>
      )}
      {isOpen && <ChatPanel />}
    </>
  );
}
