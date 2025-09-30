export type Emotion = '😄' | '😊' | '🙂' | '😐' | '🤔' | '😟' | '😢' | '😠' | '🥰' | '🎉';

export interface Song {
  videoId: string;
  title: string;
}

export interface JournalEntry {
  id: string; // Using date as YYYY-MM-DD string
  date: string; // YYYY-MM-DD
  emotion: Emotion;
  keyword: string;
  notes: string;
  song: Song | null;
}

export interface YouTubeSearchResult {
    videoId: string;
    title: string;
    channel: string;
}
