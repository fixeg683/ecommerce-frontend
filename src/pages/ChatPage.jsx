import ChatPanel from '../components/chat/ChatPanel';

export default function ChatPage() {
  return (
    <div className="min-h-[70vh] rounded-3xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-semibold">Chat with Nexusmal</h1>
      <p className="mb-6 text-gray-600">Use the chat panel below for product recommendations, orders, and downloads.</p>
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 p-3 shadow-inner">
        <ChatPanel />
      </div>
    </div>
  );
}
