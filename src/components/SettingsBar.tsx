import React from 'react';
import { BookOpen, Layers, Users, User, Flame, Zap, Crown } from 'lucide-react';
import { Difficulty, GameMode, PlayerMode } from '../types';

interface SettingsBarProps {
  mode: GameMode;
  difficulty: Difficulty;
  playerMode: PlayerMode;
  onSelectMode: (mode: GameMode) => void;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onSelectPlayerMode: (pMode: PlayerMode) => void;
}

export const SettingsBar: React.FC<SettingsBarProps> = ({
  mode,
  difficulty,
  playerMode,
  onSelectMode,
  onSelectDifficulty,
  onSelectPlayerMode,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-2 select-none z-20">
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row items-center justify-between gap-2.5 sm:gap-3">
        {/* Game Mode Selector */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center w-full lg:w-auto">
          <span className="text-xs font-black text-black uppercase tracking-wider mr-1 bg-[#FFDE59] px-2 py-1 rounded-lg border-2 border-black">
            Mod:
          </span>
          <button
            type="button"
            id="btn-mode-word-tr"
            onClick={() => onSelectMode('word-tr')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer border-3 border-black ${
              mode === 'word-tr'
                ? 'bg-[#24DEFF] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                : 'bg-stone-100 text-black hover:bg-stone-200'
            }`}
          >
            <span>🇹🇷</span>
            <span>Kelime ↔ Türkçe</span>
          </button>

          <button
            type="button"
            id="btn-mode-word-def"
            onClick={() => onSelectMode('word-def')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer border-3 border-black ${
              mode === 'word-def'
                ? 'bg-[#FFDE59] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                : 'bg-stone-100 text-black hover:bg-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kelime ↔ Tanım</span>
          </button>

          <button
            type="button"
            id="btn-mode-sentence"
            onClick={() => onSelectMode('sentence-match')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer border-3 border-black ${
              mode === 'sentence-match'
                ? 'bg-[#77D970] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                : 'bg-stone-100 text-black hover:bg-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cümle İçi Boşluk</span>
          </button>
        </div>

        {/* Difficulty & Player Mode Group */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center w-full lg:w-auto">
          {/* Difficulty Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border-2 border-black">
            <button
              type="button"
              id="btn-diff-hard"
              onClick={() => onSelectDifficulty('hard')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                difficulty === 'hard'
                  ? 'bg-[#FFDE59] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black/80 hover:text-black'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-black" />
              <span>Zor (16)</span>
            </button>

            <button
              type="button"
              id="btn-diff-extreme"
              onClick={() => onSelectDifficulty('extreme')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                difficulty === 'extreme'
                  ? 'bg-[#FF914D] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black/80 hover:text-black'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-black" />
              <span>Çok Zor (24)</span>
            </button>

            <button
              type="button"
              id="btn-diff-master"
              onClick={() => onSelectDifficulty('master')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                difficulty === 'master'
                  ? 'bg-[#FF5757] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black/80 hover:text-black'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Master (32)</span>
            </button>
          </div>

          {/* Player Mode (Solo vs Team) */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border-2 border-black">
            <button
              type="button"
              id="btn-player-single"
              onClick={() => onSelectPlayerMode('single')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                playerMode === 'single'
                  ? 'bg-[#24DEFF] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'text-black/80 hover:text-black'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Bireysel</span>
            </button>

            <button
              type="button"
              id="btn-player-team"
              onClick={() => onSelectPlayerMode('team')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition-all ${
                playerMode === 'team'
                  ? 'bg-[#77D970] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black'
                  : 'text-black/80 hover:text-black'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2 Takım (Sınıf)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

