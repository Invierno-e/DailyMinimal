import { Emotion } from './types';

export const EMOTIONS: { emotion: Emotion; label: string }[] = [
  { emotion: '😄', label: 'Feliz' },
  { emotion: '😊', label: 'Contento' },
  { emotion: '🥰', label: 'Amado' },
  { emotion: '🎉', label: 'Celebrando' },
  { emotion: '🙂', label: 'Normal' },
  { emotion: '🤔', label: 'Pensativo' },
  { emotion: '😐', label: 'Neutral' },
  { emotion: '😟', label: 'Preocupado' },
  { emotion: '😢', label: 'Triste' },
  { emotion: '😠', label: 'Enojado' },
];

export const LOCAL_STORAGE_KEY = 'zenithJournalEntries';
