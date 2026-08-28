import React from 'react';
import {
  Trophy,
  Flame,
  Clock,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  Smile,
  Frown,
} from 'lucide-react';
import { GameStats, PlayerMode } from '../types';
import { formatTime } from '../utils/gameHelpers';

interface ScoreHeaderProps {
  stats: GameStats;
  playerMode: PlayerMode;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onTestApplause: () => void;
  onTestCrying: () => void;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  stats,
  playerMode,
  isMuted,
  onToggleMute,
  onRestart,
  isFullscreen,
  onToggleFullscreen,
  onTestApplause,
  onTestCrying,
}) => {
  return (
    <header className="w-full bg-[#FF5757] border-b-4 border-black text-black px-3 sm:px-6 py-3 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] select-none z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: App Title & Unit Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#FFDE59] border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  8. SINIF • FRIENDSHIP
                </h1>
                <span className="bg-[#FFDE59] text-black text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  ZOR SEVİYE
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                Akıllı Tahta İngilizce Hafıza & Eşleştirme Oyunu
              </p>
            </div>
          </div>

          {/* Quick Sound Test buttons for Interactive Classroom Smart Board */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              type="button"
              id="btn-quick-applause-mobile"
              onClick={onTestApplause}
              title="Alkış Sesi Çal"
              className="px-2 py-1 bg-[#77D970] text-black rounded-xl text-xs font-black flex items-center gap-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Smile className="w-3.5 h-3.5" /> Alkış
            </button>
            <button
              type="button"
              id="btn-quick-crying-mobile"
              onClick={onTestCrying}
              title="Ağlama Sesi Çal"
              className="px-2 py-1 bg-[#24DEFF] text-black rounded-xl text-xs font-black flex items-center gap-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Frown className="w-3.5 h-3.5" /> Ağlama
            </button>
          </div>
        </div>

        {/* Center: Live Metrics HUD (High-contrast Comic Neo-Brutalist cards) */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 w-full md:w-auto">
          {/* Score Box */}
          <div className="flex items-center gap-2 bg-white border-3 border-black px-3 sm:px-4 py-1.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Trophy className="w-5 h-5 text-[#FF914D]" />
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-black text-black/70 uppercase tracking-wider">
                {playerMode === 'team' ? 'Toplam Puan' : 'Puan'}
              </span>
              <span className="text-lg sm:text-2xl font-black text-black leading-none">
                {stats.score}
              </span>
            </div>
          </div>

          {/* Combo / Streak Indicator */}
          {stats.streak > 1 && (
            <div className="flex items-center gap-1.5 bg-[#FFDE59] border-3 border-black px-3 py-1.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-bounce">
              <Flame className="w-5 h-5 text-red-600 fill-red-600" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-black uppercase tracking-wider">
                  KOMBO SERİSİ
                </span>
                <span className="text-base sm:text-xl font-black text-black leading-none">
                  {stats.streak}x 🔥
                </span>
              </div>
            </div>
          )}

          {/* Pairs Matched */}
          <div className="flex items-center gap-2 bg-[#24DEFF] border-3 border-black px-3 sm:px-4 py-1.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="w-5 h-5 text-black" />
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-black text-black/80 uppercase tracking-wider">
                Eşleşme
              </span>
              <span className="text-lg sm:text-2xl font-black text-black leading-none">
                {stats.matchedPairs} / {stats.totalPairs}
              </span>
            </div>
          </div>

          {/* Moves */}
          <div className="flex items-center gap-2 bg-white border-3 border-black px-3 sm:px-4 py-1.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-black text-black/70 uppercase tracking-wider">
                Hamle
              </span>
              <span className="text-lg sm:text-2xl font-black text-black leading-none">
                {stats.moves}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 bg-[#77D970] border-3 border-black px-3 sm:px-4 py-1.5 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Clock className="w-5 h-5 text-black" />
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-black text-black/80 uppercase tracking-wider">
                Süre
              </span>
              <span className="text-lg sm:text-2xl font-black font-mono text-black leading-none">
                {formatTime(stats.timeSpent)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Smart Board Actions & Sound controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Sound test buttons on desktop/smartboard */}
          <div className="hidden lg:flex items-center gap-1.5 bg-black/15 p-1 rounded-2xl border-2 border-black/30">
            <button
              type="button"
              id="btn-test-applause"
              onClick={onTestApplause}
              title="Alkış Sesini Test Et"
              className="px-2.5 py-1.5 bg-[#77D970] hover:bg-[#68c962] text-black border-2 border-black rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Smile className="w-4 h-4" />
              <span>👏 ALKIŞ</span>
            </button>
            <button
              type="button"
              id="btn-test-crying"
              onClick={onTestCrying}
              title="Ağlama Sesini Test Et"
              className="px-2.5 py-1.5 bg-[#24DEFF] hover:bg-[#1fcae8] text-black border-2 border-black rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Frown className="w-4 h-4" />
              <span>😭 AĞLAMA</span>
            </button>
          </div>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            id="btn-toggle-sound"
            onClick={onToggleMute}
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            className={`p-2.5 sm:p-3 rounded-2xl border-3 border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center ${
              isMuted
                ? 'bg-[#FF3131] text-white hover:bg-red-600'
                : 'bg-white hover:bg-[#FFDE59]'
            }`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Fullscreen for Smart Board */}
          <button
            type="button"
            id="btn-toggle-fullscreen"
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Akıllı Tahta Tam Ekran Modu'}
            className="p-2.5 sm:p-3 rounded-2xl bg-white hover:bg-[#FFDE59] border-3 border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Restart */}
          <button
            type="button"
            id="btn-restart-game"
            onClick={onRestart}
            title="Oyunu Sıfırla ve Yeniden Karıştır"
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-[#FFDE59] hover:bg-yellow-300 text-black font-black text-xs sm:text-sm flex items-center gap-1.5 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Yeniden Başlat</span>
          </button>
        </div>
      </div>
    </header>
  );
};

