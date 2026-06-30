import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatProductCard from './ChatProductCard';
import OrderStatusCard from './OrderStatusCard';

export default function MessageList({ messages }) {
  const navigate = useNavigate();
  const groupedMessages = useMemo(() => messages, [messages]);

  return (
    <div className="space-y-3">
      {groupedMessages.map((message, index) => {
        const isUser = message.role === 'user';
        return (
          <div key={`${message.role}-${index}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${isUser ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>
              <p className="whitespace-pre-wrap">
                {message.content}
                {message.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-gray-500 animate-pulse align-middle" />}
              </p>
              {message.products && message.products.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.products.map((product) => (
                    <ChatProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
                  ))}
                </div>
              )}
              {message.content?.toLowerCase().includes('order') && <OrderStatusCard />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
