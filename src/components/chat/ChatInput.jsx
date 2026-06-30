import { useState } from 'react';
import { SendHorizonal } from 'lucide-react';

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-3">
      <div className="flex items-end gap-2 rounded-2xl border border-gray-200 p-2">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={1}
          placeholder="Type your message..."
          className="flex-1 resize-none border-none bg-transparent p-1 text-sm outline-none"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
        />
        <button type="submit" className="rounded-full bg-black p-2 text-white">
          <SendHorizonal size={16} />
        </button>
      </div>
    </form>
  );
}
