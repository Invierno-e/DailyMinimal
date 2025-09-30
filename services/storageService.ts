

import { JournalEntry } from '../types.ts';
import { LOCAL_STORAGE_KEY } from '../constants.ts';

export const getEntries = (): JournalEntry[] => {
  try {
    const entriesJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!entriesJson) return [];
    const entries = JSON.parse(entriesJson) as JournalEntry[];
    // Sort entries by date descending
    return entries.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error("Failed to load entries from localStorage", error);
    return [];
  }
};

export const saveEntries = (entries: JournalEntry[]): void => {
  try {
    const entriesJson = JSON.stringify(entries);
    localStorage.setItem(LOCAL_STORAGE_KEY, entriesJson);
  } catch (error) {
    console.error("Failed to save entries to localStorage", error);
  }
};