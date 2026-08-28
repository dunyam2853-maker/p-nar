import { UNIT1_VOCABULARY } from '../data/unit1Vocabulary';
import { Difficulty, GameCard, GameMode } from '../types';

export function getPairsCountForDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'hard':
      return 8; // 16 cards
    case 'extreme':
      return 12; // 24 cards
    case 'master':
      return 16; // 32 cards
    default:
      return 8;
  }
}

// Artistic Flair pop comic color palettes for flipped cards
const CARD_PALETTES = [
  'bg-white text-black',
  'bg-[#24DEFF] text-black',
  'bg-[#FFDE59] text-black',
  'bg-[#77D970] text-black',
  'bg-[#FF914D] text-black',
  'bg-[#FF5757] text-white',
  'bg-[#C084FC] text-black',
  'bg-[#38BDF8] text-black',
  'bg-[#F472B6] text-black',
  'bg-[#A7F3D0] text-black',
  'bg-[#FDE047] text-black',
  'bg-[#FB923C] text-black',
  'bg-[#818CF8] text-white',
  'bg-[#4ADE80] text-black',
  'bg-[#E879F9] text-black',
  'bg-[#67E8F9] text-black',
];

export function generateGameCards(mode: GameMode, difficulty: Difficulty): GameCard[] {
  const pairCount = getPairsCountForDifficulty(difficulty);

  // Shuffle vocabulary and pick pairCount items
  const shuffledVocab = [...UNIT1_VOCABULARY].sort(() => Math.random() - 0.5);
  const selectedVocab = shuffledVocab.slice(0, pairCount);

  const cards: GameCard[] = [];

  selectedVocab.forEach((item, index) => {
    const palette = CARD_PALETTES[index % CARD_PALETTES.length];

    // Card 1: English Word Prompt
    const cardPrompt: GameCard = {
      id: `card-${item.id}-prompt`,
      vocabId: item.id,
      type: 'prompt',
      content: item.word,
      subContent: item.synonym ? `≈ ${item.synonym}` : undefined,
      badge: '🇬🇧 ENGLISH',
      color: palette,
      isFlipped: false,
      isMatched: false,
      emoji: item.emoji,
    };

    // Card 2: Target (Turkish / Definition / Sentence based on Mode)
    let targetContent = item.turkish;
    let targetSubContent: string | undefined = undefined;
    let targetBadge = '🇹🇷 TÜRKÇE';

    if (mode === 'word-def') {
      targetContent = item.definition;
      targetSubContent = item.synonym ? `💡 Eş: ${item.synonym}` : undefined;
      targetBadge = '📖 DEFINITION';
    } else if (mode === 'sentence-match') {
      // Replace target word in example sentence with blank "_____"
      const regex = new RegExp(item.word.split('/')[0].trim(), 'gi');
      targetContent = item.exampleSentence.replace(regex, '______');
      targetSubContent = `🇹🇷 ${item.turkish}`;
      targetBadge = '✍️ CÜMLE BOŞLUĞU';
    }

    const cardTarget: GameCard = {
      id: `card-${item.id}-target`,
      vocabId: item.id,
      type: 'target',
      content: targetContent,
      subContent: targetSubContent,
      badge: targetBadge,
      color: palette,
      isFlipped: false,
      isMatched: false,
      emoji: item.emoji,
    };

    cards.push(cardPrompt, cardTarget);
  });

  // Fisher-Yates Shuffle cards
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
