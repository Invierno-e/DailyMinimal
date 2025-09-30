import React from 'react';
import { JournalEntry, Emotion } from '../types';
import { EMOTIONS } from '../constants';
// FIX: Add .tsx extension to icons import.
import { CloseIcon } from './icons.tsx';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, entries }) => {
  if (!isOpen) return null;

  const emotionCounts: Record<Emotion, number> = EMOTIONS.reduce((acc, { emotion }) => {
    acc[emotion] = 0;
    return acc;
  }, {} as Record<Emotion, number>);
  
  entries.forEach(entry => {
    if (Object.prototype.hasOwnProperty.call(emotionCounts, entry.emotion)) {
      emotionCounts[entry.emotion]++;
    }
  });

  const totalEntries = entries.length;
  const maxCount = Math.max(...Object.values(emotionCounts), 1); // Avoid division by zero

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Estadísticas del Diario</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Resumen de Emociones ({totalEntries} entradas)</h3>
          <div className="space-y-4">
            {EMOTIONS.map(({ emotion, label }) => {
              const count = emotionCounts[emotion] || 0;
              const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
              return (
                <div key={emotion} className="flex items-center gap-4">
                  <span className="text-2xl w-8 text-center">{emotion}</span>
                  <div className="flex-grow">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm font-medium text-gray-600">{label}</span>
                      <span className="text-sm text-gray-500">{count} {count === 1 ? 'vez' : 'veces'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;