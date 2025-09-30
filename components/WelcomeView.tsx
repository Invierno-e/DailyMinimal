import React from 'react';

interface WelcomeViewProps {
  onNewEntry: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onNewEntry }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Bienvenido a Zenith</h1>
      <p className="text-lg text-gray-600 mb-6">Tu diario personal para registrar emociones y momentos.</p>
      <button
        onClick={onNewEntry}
        className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
      >
        Crear tu primera entrada
      </button>
    </div>
  );
};

export default WelcomeView;
