import React, { useState, useEffect } from 'react';
import { JournalEntry, Emotion, Song } from '../types';
import { EMOTIONS } from '../constants';
import SongSearch from './SongSearch.tsx';
import { MusicIcon, TrashIcon } from './icons.tsx';

interface JournalEditorProps {
  entry: JournalEntry | null;
  onSave: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ entry, onSave, onDelete, onCancel }) => {
  const [emotion, setEmotion] = useState<Emotion>('🙂');
  const [keyword, setKeyword] = useState('');
  const [notes, setNotes] = useState('');
  const [song, setSong] = useState<Song | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (entry) {
      setEmotion(entry.emotion);
      setKeyword(entry.keyword);
      setNotes(entry.notes);
      setSong(entry.song);
    } else {
      // Reset for new entry
      setEmotion('🙂');
      setKeyword('');
      setNotes('');
      setSong(null);
    }
  }, [entry]);

  const handleSave = () => {
    if (!keyword.trim()) {
      alert('Por favor, ingresa una palabra clave.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const newEntry: JournalEntry = {
      id: entry?.id || today,
      date: entry?.date || today,
      emotion,
      keyword: keyword.trim(),
      notes: notes.trim(),
      song,
    };
    onSave(newEntry);
  };

  const handleDelete = () => {
    if (entry && window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
        onDelete(entry.id);
    }
  };

  const handleSelectSong = (selectedSong: Song) => {
    setSong(selectedSong);
    setIsSearching(false);
  };

  const date = entry?.date || new Date().toISOString().split('T')[0];
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="flex-grow flex flex-col p-6 bg-white overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{formattedDate}</h2>
        <div>
            {entry && (
                <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 font-semibold py-2 px-4 rounded-md mr-2 flex items-center gap-2"
                >
                    <TrashIcon />
                    Eliminar
                </button>
            )}
            <button onClick={onCancel} className="text-gray-600 hover:text-gray-800 font-semibold py-2 px-4 rounded-md mr-2">
                Cancelar
            </button>
            <button onClick={handleSave} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600">
                Guardar
            </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">¿Cómo te sientes hoy?</label>
        <div className="flex flex-wrap gap-2 bg-gray-100 p-3 rounded-lg">
          {EMOTIONS.map(({ emotion: e, label }) => (
            <button
              key={e}
              onClick={() => setEmotion(e)}
              className={`text-3xl p-2 rounded-lg transition-transform transform hover:scale-125 ${emotion === e ? 'bg-blue-200 ring-2 ring-blue-500' : 'bg-transparent'}`}
              title={label}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="keyword" className="block text-lg font-medium text-gray-700 mb-2">
          Una palabra clave para hoy
        </label>
        <input
          id="keyword"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Ej: Productivo, Relajado, etc."
          className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="notes" className="block text-lg font-medium text-gray-700 mb-2">
          Notas adicionales
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="Escribe más sobre tu día..."
          className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">Canción del día</label>
        {song ? (
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
            <div>
              <p className="font-semibold">{song.title}</p>
              <a
                href={`https://www.youtube.com/watch?v=${song.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Ver en YouTube
              </a>
            </div>
            <button onClick={() => setSong(null)} className="text-red-500 hover:text-red-700">
              <TrashIcon />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsSearching(true)}
            className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-md hover:bg-gray-300 flex items-center justify-center gap-2"
          >
            <MusicIcon />
            Añadir canción
          </button>
        )}
      </div>

      {isSearching && <SongSearch onSelectSong={handleSelectSong} onClose={() => setIsSearching(false)} />}
    </div>
  );
};

export default JournalEditor;