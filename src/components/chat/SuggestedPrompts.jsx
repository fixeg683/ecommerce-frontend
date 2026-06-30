const prompts = [
  'Recommend a product',
  'Help me track my order',
  'Show me download options',
  'Suggest something under KES 500',
  'What is new this week?',
  'I need help shopping',
];

export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="mt-4 space-y-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="block w-full rounded-full border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
