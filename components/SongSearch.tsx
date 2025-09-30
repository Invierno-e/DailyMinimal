import React, { useState } from 'react';
import { searchYouTubeVideos } from '../services/geminiService';
import { Song, YouTubeSearchResult } from '../types';
// FIX: Add .tsx extension to icons import.
import { SearchIcon, CloseIcon } from './icons.tsx';

interface SongSearchProps {
  onSelectSong: (song: Song) => void;
  onClose: () => void;
}

const SongSearch: React.FC<SongSearchProps> = ({ onSelectSong, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<YouTubeSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setResults([]);
    try {
      const searchResults = await searchYouTubeVideos(query);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (result: YouTubeSearchResult) => {
    onSelectSong({ videoId: result.videoId, title: result.title });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Buscar Canción</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <CloseIcon />
          </button>
        </div>
        <div className="p-4 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Artista, canción..."
            className="flex-grow border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2"
          >
            <SearchIcon />
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-grow">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {results.length > 0 && (
            <ul className="space-y-2">
              {results.map((result) => (
                <li
                  key={result.videoId}
                  onClick={() => handleSelect(result)}
                  className="p-3 rounded-md hover:bg-gray-100 cursor-pointer border"
                >
                  <p className="font-semibold text-gray-800">{result.title}</p>
                  <p className="text-sm text-gray-500">{result.channel}</p>
                </li>
              ))}
            </ul>
          )}
          {!isLoading && !error && results.length === 0 && query && (
             <p className="text-center text-gray-500 pt-4">No se encontraron resultados. Intenta con otra búsqueda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongSearch;