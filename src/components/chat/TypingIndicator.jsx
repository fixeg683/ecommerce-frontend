export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2">
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.3s]" />
    </div>
  );
}
