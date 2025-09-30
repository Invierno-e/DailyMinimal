import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import JournalEditor from './components/JournalEditor.tsx';
import WelcomeView from './components/WelcomeView.tsx';
import StatsModal from './components/StatsModal.tsx';
import { JournalEntry } from './types';
import { getEntries, saveEntries } from './services/storageService';

type View = 'WELCOME' | 'EDITOR';

const App: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null); // Entry being viewed/edited
  const [view, setView] = useState<View>('WELCOME');
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  useEffect(() => {
    const loadedEntries = getEntries();
    setEntries(loadedEntries);
    if (loadedEntries.length > 0) {
      setActiveEntry(loadedEntries[0]);
      setView('EDITOR');
    } else {
      setView('WELCOME');
    }
  }, []);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const handleSelectEntry = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setView('EDITOR');
  };

  const handleNewEntry = () => {
    setActiveEntry(null); // Indicates a new entry
    setView('EDITOR');
  };
  
  const handleCancelEdit = () => {
    if (entries.length > 0) {
        // If we were creating a new entry, select the latest one.
        if (!activeEntry) {
            setActiveEntry(entries[0]);
        }
        setView('EDITOR');
    } else {
        setActiveEntry(null);
        setView('WELCOME');
    }
  };

  const handleSaveEntry = (entryToSave: JournalEntry) => {
    const isNew = !entries.some(e => e.id === entryToSave.id);
    let updatedEntries;
    if (isNew) {
      updatedEntries = [entryToSave, ...entries];
    } else {
      updatedEntries = entries.map(e => e.id === entryToSave.id ? entryToSave : e);
    }
    
    updatedEntries.sort((a, b) => b.date.localeCompare(a.date));

    setEntries(updatedEntries);
    setActiveEntry(entryToSave);
    setView('EDITOR');
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = entries.filter(e => e.id !== id);
    setEntries(updatedEntries);
    if (updatedEntries.length > 0) {
        setActiveEntry(updatedEntries[0]);
        setView('EDITOR');
    } else {
        setActiveEntry(null);
        setView('WELCOME');
    }
  };

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      <Sidebar
        entries={entries}
        selectedEntry={activeEntry}
        onSelectEntry={handleSelectEntry}
        onNewEntry={handleNewEntry}
        onShowStats={() => setIsStatsOpen(true)}
      />
      <main className="flex-1 flex flex-col">
        {view === 'EDITOR' ? (
            <JournalEditor
                entry={activeEntry}
                onSave={handleSaveEntry}
                onDelete={handleDeleteEntry}
                onCancel={handleCancelEdit}
            />
        ) : (
            <WelcomeView onNewEntry={handleNewEntry} />
        )}
      </main>
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        entries={entries}
      />
    </div>
  );
};

export default App;
