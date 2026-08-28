export type GameMode = 'word-tr' | 'word-def' | 'sentence-match';

export type Difficulty = 'hard' | 'extreme' | 'master';

export type PlayerMode = 'single' | 'team';

export interface VocabItem {
  id: string;
  word: string;
  turkish: string;
  definition: string;
  exampleSentence: string;
  synonym?: string;
  antonym?: string;
  category: 'personal-trait' | 'relationship' | 'invitation' | 'idiom';
  emoji: string;
  color: string;
}

export interface GameCard {
  id: string;
  vocabId: string;
  type: 'prompt' | 'target';
  content: string;
  subContent?: string;
  badge?: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
  emoji?: string;
}

export interface GameStats {
  score: number;
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  streak: number;
  bestStreak: number;
  timeSpent: number; // in seconds
  teamScores?: {
    team1: number;
    team2: number;
    team1Pairs: number;
    team2Pairs: number;
  };
  currentTurn?: 1 | 2;
}
