import React, { useState } from 'react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
    }
  };

  const placeholderText = "e.g., Find a route from SFO to Fisherman's Wharf with a stop at a highly-rated cafe, and show me nearby parking...";

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholderText}
        disabled={isLoading}
        rows={3}
        className="w-full p-4 pr-32 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-300 resize-none placeholder-gray-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="absolute top-1/2 right-4 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:from-gray-600 disabled:to-gray-700"
      >
        {isLoading ? 'Working...' : 'Ask'}
      </button>
    </form>
  );
};
