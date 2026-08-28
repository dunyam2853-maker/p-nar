import React from 'react';
import { Shield, Award, Sparkles } from 'lucide-react';
import { GameStats } from '../types';

interface TeamScoreboardProps {
  stats: GameStats;
}

export const TeamScoreboard: React.FC<TeamScoreboardProps> = ({ stats }) => {
  const currentTurn = stats.currentTurn || 1;
  const teamScores = stats.teamScores || { team1: 0, team2: 0, team1Pairs: 0, team2Pairs: 0 };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-1.5 select-none z-20">
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {/* TEAM 1: MAVİ / CYAN TAKIM */}
        <div
          className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-4 border-4 border-black transition-all duration-200 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${
            currentTurn === 1
              ? 'bg-[#24DEFF] text-black ring-4 ring-black scale-[1.01]'
              : 'bg-white/90 text-black/70 opacity-75'
          }`}
        >
          {currentTurn === 1 && (
            <div className="absolute top-2 right-2 bg-yellow-300 text-black border-2 border-black px-2 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider animate-bounce flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-3 h-3" /> SIRA MAVİ TAKIMDA!
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-white border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black font-black text-lg sm:text-2xl">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-black" />
                <h3 className="text-sm sm:text-lg font-black text-black tracking-wide uppercase">
                  1. MAVİ TAKIM
                </h3>
              </div>
              <div className="flex items-center gap-3 sm:gap-6 mt-1">
                <div>
                  <span className="text-[10px] sm:text-xs text-black/70 font-black block">Puan</span>
                  <span className="text-xl sm:text-3xl font-black text-black leading-none">
                    {teamScores.team1}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs text-black/70 font-black block">Eşleşme</span>
                  <span className="text-lg sm:text-2xl font-black text-black leading-none">
                    {teamScores.team1Pairs} Çift
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TEAM 2: KIRMIZI TAKIM */}
        <div
          className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-4 border-4 border-black transition-all duration-200 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${
            currentTurn === 2
              ? 'bg-[#FF5757] text-white ring-4 ring-black scale-[1.01]'
              : 'bg-white/90 text-black/70 opacity-75'
          }`}
        >
          {currentTurn === 2 && (
            <div className="absolute top-2 right-2 bg-yellow-300 text-black border-2 border-black px-2 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider animate-bounce flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-3 h-3" /> SIRA KIRMIZI TAKIMDA!
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-white border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black font-black text-lg sm:text-2xl">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-white" />
                <h3 className="text-sm sm:text-lg font-black text-white tracking-wide uppercase drop-shadow">
                  2. KIRMIZI TAKIM
                </h3>
              </div>
              <div className="flex items-center gap-3 sm:gap-6 mt-1">
                <div>
                  <span className="text-[10px] sm:text-xs text-white/80 font-black block">Puan</span>
                  <span className="text-xl sm:text-3xl font-black text-white leading-none">
                    {teamScores.team2}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs text-white/80 font-black block">Eşleşme</span>
                  <span className="text-lg sm:text-2xl font-black text-white leading-none">
                    {teamScores.team2Pairs} Çift
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

