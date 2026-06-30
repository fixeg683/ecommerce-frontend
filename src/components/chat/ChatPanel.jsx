import { useEffect, useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { createSession, fetchHistory } from '../../services/chatService';
import { useChatSocket } from '../../hooks/useChatSocket';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import SuggestedPrompts from './SuggestedPrompts';

export default function ChatPanel() {
  const { closeChat, sessionId, setSessionId, messages, setMessages } = useChat();
  const [loading, setLoading] = useState(true);
  const { sendMessage } = useChatSocket();

  useEffect(() => {
    const initSession = async () => {
      try {
        if (!sessionId) {
          const session = await createSession();
          setSessionId(session.id);
          const history = await fetchHistory(session.id);
          setMessages(history.messages || []);
        } else {
          const history = await fetchHistory(sessionId);
          setMessages(history.messages || []);
        }
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [sessionId, setSessionId, setMessages]);

  return (
    <div className="fixed bottom-24 right-6 z-40 flex h-[580px] w-[360px] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b bg-black px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <button onClick={closeChat} className="rounded-full p-1 hover:bg-white/10">
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="font-semibold">Nexusmal Assistant</p>
            <p className="text-xs text-gray-300">Always here to help</p>
          </div>
        </div>
        <Sparkles size={18} />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="mt-10 text-center text-sm text-gray-500">Connecting...</div>
        ) : messages.length === 0 ? (
          <>
            <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
              Ask me for product recommendations, order help, or downloads.
            </div>
            <SuggestedPrompts onSelect={sendMessage} />
          </>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
