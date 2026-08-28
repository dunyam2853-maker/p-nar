import React from 'react';
import { Volume2, CheckCircle2, Sparkles } from 'lucide-react';
import { GameCard } from '../types';
import { speakWord } from '../utils/speech';

interface CardItemProps {
  card: GameCard;
  onClick: () => void;
  disabled: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onClick, disabled }) => {
  const isInteractive = !card.isFlipped && !card.isMatched && !disabled;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakWord(card.content);
  };

  return (
    <div
      id={`card-${card.id}`}
      onClick={() => {
        if (isInteractive) {
          onClick();
        }
      }}
      className={`group relative select-none w-full h-36 sm:h-40 md:h-44 lg:h-48 cursor-pointer [perspective:1000px] transition-all duration-150 ${
        isInteractive ? 'hover:-translate-y-1 hover:-translate-x-1' : ''
      }`}
      role="button"
      tabIndex={isInteractive ? 0 : -1}
      aria-label={`Card: ${card.isFlipped || card.isMatched ? card.content : 'Hidden'}`}
    >
      <div
        className={`w-full h-full duration-500 [transform-style:preserve-3d] transition-transform rounded-2xl sm:rounded-3xl relative ${
          card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Card Back (Hidden state) - Artistic Flair Vibrant Tangerine Pop with ? */}
        <div
          className={`absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-between border-4 border-black bg-[#FF914D] text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-150 ${
            isInteractive ? 'group-hover:bg-[#ff9d5c] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' : ''
          }`}
        >
          {/* Top header badge */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              UNIT 1
            </span>
            <span className="w-3 h-3 rounded-full bg-black"></span>
          </div>

          {/* Center visual icon & question mark */}
          <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform group-hover:rotate-6 transition-transform">
              <span className="text-4xl sm:text-5xl font-black text-black leading-none">?</span>
            </div>
            <span className="text-xs sm:text-sm font-black text-black tracking-wider uppercase mt-1.5 bg-yellow-300 px-2 py-0.5 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              FRIENDSHIP
            </span>
          </div>

          {/* Bottom badge */}
          <div className="w-full flex items-center justify-center z-10">
            <span className="text-[10px] sm:text-xs font-black text-black tracking-wider uppercase bg-white/80 px-2 py-0.5 rounded border border-black">
              DOKUN & AÇ
            </span>
          </div>
        </div>

        {/* Card Front (Flipped / Matched state) - Artistic Flair High Contrast Pop */}
        <div
          className={`absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 flex flex-col justify-between border-4 border-black ${
            card.isMatched
              ? 'bg-[#77D970] text-black ring-4 ring-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
              : `${card.color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`
          } overflow-hidden transition-all duration-300`}
        >
          {/* Top category / badge header */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {card.badge}
            </span>
            <div className="flex items-center gap-1.5">
              {card.emoji && <span className="text-lg sm:text-xl drop-shadow">{card.emoji}</span>}
              {card.type === 'prompt' && (
                <button
                  type="button"
                  id={`btn-speak-${card.id}`}
                  onClick={handleSpeak}
                  title="İngilizce Telaffuz Dinle"
                  className="p-1 sm:p-1.5 rounded-lg bg-[#FFDE59] hover:bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <Volume2 className="w-4 h-4 text-black" />
                </button>
              )}
            </div>
          </div>

          {/* Main Card Content (Ultra-large, crisp comic text for smart board) */}
          <div className="flex-1 flex flex-col items-center justify-center text-center my-1 z-10 px-1 overflow-hidden">
            <p
              className={`font-black tracking-tight leading-snug break-words max-h-full overflow-y-auto ${
                card.content.length > 35
                  ? 'text-sm sm:text-base md:text-lg font-black'
                  : card.content.length > 20
                  ? 'text-base sm:text-lg md:text-xl lg:text-2xl font-black'
                  : 'text-xl sm:text-2xl md:text-3xl font-black'
              }`}
            >
              {card.content}
            </p>

            {/* Sub-content / Clue / Synonym / Meaning */}
            {card.subContent && (
              <p className="mt-1.5 text-[11px] sm:text-xs md:text-sm font-bold text-black bg-white/90 px-2 py-0.5 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-w-full truncate">
                {card.subContent}
              </p>
            )}
          </div>

          {/* Bottom helper */}
          <div className="w-full flex items-center justify-between text-[10px] sm:text-xs font-black z-10">
            <span className="bg-black text-white px-2 py-0.5 rounded border border-black">Unit 1</span>
            {card.isMatched ? (
              <span className="flex items-center gap-1 bg-white text-black px-2 py-0.5 rounded-md border-2 border-black font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce">
                <span>👏</span> EŞLEŞTİ!
              </span>
            ) : (
              <span className="opacity-70">8. Sınıf</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

