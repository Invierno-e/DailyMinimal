import React from 'react';
import { JournalEntry } from '../types.ts';
import { PlusIcon, StatsIcon } from './icons.tsx';

interface SidebarProps {
  entries: JournalEntry[];
  selectedEntry: JournalEntry | null;
  onSelectEntry: (entry: JournalEntry) => void;
  onNewEntry: () => void;
  onShowStats: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ entries, selectedEntry, onSelectEntry, onNewEntry, onShowStats }) => {
  return (
    <div className="w-1/3 max-w-sm bg-gray-100 border-r overflow-y-auto flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Zenith</h1>
        <p className="text-sm text-gray-500">Tu Diario Emocional</p>
      </div>
      <div className="p-4 flex gap-2">
        <button
          onClick={onNewEntry}
          className="flex-1 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <PlusIcon />
          Nueva Entrada
        </button>
        <button
          onClick={onShowStats}
          disabled={entries.length === 0}
          className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <StatsIcon />
          Estadísticas
        </button>
      </div>
      <div className="flex-grow">
        {entries.map(entry => {
          const isSelected = selectedEntry?.id === entry.id;
          return (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className={`p-4 cursor-pointer border-b border-l-4 ${isSelected ? 'border-l-blue-500 bg-white' : 'border-l-transparent hover:bg-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-lg">{entry.emotion}</span>
                <p className="text-sm text-gray-500">{new Date(entry.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
              </div>
              <p className="font-semibold text-gray-800 truncate">{entry.keyword}</p>
              <p className="text-sm text-gray-600 truncate">{entry.notes || 'Sin notas adicionales.'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;