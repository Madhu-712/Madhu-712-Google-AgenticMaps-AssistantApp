import React from 'react';

interface HeaderProps {
  locationStatus: string;
}

const LocationIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ locationStatus }) => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
        Agentic Maps Assistant
      </h1>
      <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">
        Ask complex location-based questions. Our AI agents will collaborate to find the answer.
      </p>
      <div className="mt-4 inline-flex items-center text-sm text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
        <LocationIcon />
        {locationStatus}
      </div>
    </header>
  );
};
