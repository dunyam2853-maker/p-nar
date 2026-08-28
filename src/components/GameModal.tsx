import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { GameStats, PlayerMode } from '../types';
import { UNIT1_VOCABULARY } from '../data/unit1Vocabulary';
import { formatTime } from '../utils/gameHelpers';
import { speakWord } from '../utils/speech';

interface GameModalProps {
  isOpen: boolean;
  stats: GameStats;
  playerMode: PlayerMode;
  onRestart: () => void;
  onClose: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  stats,
  playerMode,
  onRestart,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger celebratory confetti bursts
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate Accuracy
  const accuracy =
    stats.moves > 0
      ? Math.min(100, Math.round((stats.totalPairs / stats.moves) * 100))
      : 100;

  // Determine Team Winner if in team mode
  let teamResult = '';
  let teamWinnerBg = '';
  if (playerMode === 'team' && stats.teamScores) {
    const t1 = stats.teamScores.team1;
    const t2 = stats.teamScores.team2;
    if (t1 > t2) {
      teamResult = '🏆 1. MAVİ TAKIM KAZANDI!';
      teamWinnerBg = 'bg-[#24DEFF] text-black';
    } else if (t2 > t1) {
      teamResult = '🏆 2. KIRMIZI TAKIM KAZANDI!';
      teamWinnerBg = 'bg-[#FF5757] text-white';
    } else {
      teamResult = '🤝 DOSTLUK KAZANDI (BERABERE)!';
      teamWinnerBg = 'bg-[#FFDE59] text-black';
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border-4 sm:border-8 border-black rounded-3xl p-5 sm:p-8 text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] my-8 animate-in fade-in zoom-in duration-200">
        {/* Celebration Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#FFDE59] border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-3 transform hover:rotate-6 transition-transform">
            <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-black" />
          </div>

          <span className="px-4 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest bg-[#77D970] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-2">
            TEBRİKLER! 👏 HARİKA İŞ!
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-black">
            8. Sınıf Unit 1 Tamamlandı!
          </h2>

          {playerMode === 'team' && (
            <div className={`mt-3 text-xl sm:text-2xl font-black ${teamWinnerBg} px-5 py-2 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
              {teamResult}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-5">
          {/* Total Score */}
          <div className="bg-[#FFDE59] border-3 border-black rounded-2xl p-3 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black text-black/70 block uppercase">Puan</span>
            <span className="text-2xl sm:text-3xl font-black text-black">
              {stats.score}
            </span>
          </div>

          {/* Time Spent */}
          <div className="bg-[#77D970] border-3 border-black rounded-2xl p-3 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black text-black/70 block uppercase">Süre</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-black">
              {formatTime(stats.timeSpent)}
            </span>
          </div>

          {/* Moves */}
          <div className="bg-[#24DEFF] border-3 border-black rounded-2xl p-3 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black text-black/70 block uppercase">Hamle</span>
            <span className="text-2xl sm:text-3xl font-black text-black">
              {stats.moves}
            </span>
          </div>

          {/* Accuracy */}
          <div className="bg-[#FF914D] border-3 border-black rounded-2xl p-3 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black text-black/70 block uppercase">İsabet</span>
            <span className="text-2xl sm:text-3xl font-black text-black">
              %{accuracy}
            </span>
          </div>
        </div>

        {/* Team Score Comparison if in Team Mode */}
        {playerMode === 'team' && stats.teamScores && (
          <div className="grid grid-cols-2 gap-3 mb-5 p-3 rounded-2xl bg-stone-100 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center p-2 rounded-xl bg-[#24DEFF] border-2 border-black">
              <span className="text-xs font-black text-black block uppercase">1. Mavi Takım</span>
              <span className="text-2xl font-black text-black">{stats.teamScores.team1} Puan</span>
              <span className="text-xs font-bold text-black/80 block">{stats.teamScores.team1Pairs} Eşleşme</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-[#FF5757] border-2 border-black text-white">
              <span className="text-xs font-black text-white block uppercase">2. Kırmızı Takım</span>
              <span className="text-2xl font-black text-white">{stats.teamScores.team2} Puan</span>
              <span className="text-xs font-bold text-white/90 block">{stats.teamScores.team2Pairs} Eşleşme</span>
            </div>
          </div>
        )}

        {/* Vocabulary Consolidation Preview (Sınıf için Kelime Tekrarı) */}
        <div className="mb-5 bg-[#FFF9D2] rounded-2xl p-3 sm:p-4 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> 1. ÜNİTE KELİME LİSTESİ (FRIENDSHIP)
            </span>
            <span className="text-xs text-black/70 font-black">🔊 Dinlemek için dokun</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {UNIT1_VOCABULARY.slice(0, 8).map((v) => (
              <div
                key={v.id}
                onClick={() => speakWord(v.word)}
                className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-yellow-100 cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-x-0.5 active:translate-y-0.5"
                title="İngilizce Telaffuzu Dinle"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-base">{v.emoji}</span>
                  <div className="truncate">
                    <span className="text-xs font-black text-black block">{v.word}</span>
                    <span className="text-[11px] font-bold text-black/80 block truncate">{v.turkish}</span>
                  </div>
                </div>
                <Volume2 className="w-4 h-4 text-black shrink-0 ml-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            id="btn-modal-restart"
            onClick={onRestart}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#77D970] hover:bg-[#68c962] text-black font-black text-base sm:text-lg flex items-center justify-center gap-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 text-black" />
            <span>Yeniden Oyna (Yeni Kelimeler)</span>
          </button>

          <button
            type="button"
            id="btn-modal-close"
            onClick={onClose}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-stone-100 text-black font-black text-sm sm:text-base border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

