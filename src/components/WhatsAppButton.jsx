import { MessageCircle } from 'lucide-react';
import { useChat } from '../context/ChatContext';

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');

export function openWhatsApp(message = "Hello! I need help with my order.") {
  const query = encodeURIComponent(message);
  const url = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${query}`
    : `https://wa.me/?text=${query}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function WhatsAppButton() {
  const { isOpen } = useChat();

  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={() => openWhatsApp("Hello! I have a question about Nexusmall Marketplace.")}
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-24 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#1ebe5d] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-200 sm:right-6"
    >
      <MessageCircle size={22} aria-hidden="true" />
      <span>WhatsApp us</span>
    </button>
  );
}
