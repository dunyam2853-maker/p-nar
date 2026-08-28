import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Difficulty, GameCard, GameMode, GameStats, PlayerMode } from './types';
import { generateGameCards, getPairsCountForDifficulty } from './utils/gameHelpers';
import { sounds } from './utils/soundEffects';
import { ScoreHeader } from './components/ScoreHeader';
import { SettingsBar } from './components/SettingsBar';
import { TeamScoreboard } from './components/TeamScoreboard';
import { GameBoard } from './components/GameBoard';
import { GameModal } from './components/GameModal';
import { Sparkles, HelpCircle, Volume2, Frown, Smile } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<GameMode>('word-tr');
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [playerMode, setPlayerMode] = useState<PlayerMode>('single');
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<GameCard[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [lastFeedback, setLastFeedback] = useState<{
    type: 'correct' | 'wrong' | null;
    message: string;
  }>({ type: null, message: '' });

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    moves: 0,
    matchedPairs: 0,
    totalPairs: 8,
    streak: 0,
    bestStreak: 0,
    timeSpent: 0,
    teamScores: {
      team1: 0,
      team2: 0,
      team1Pairs: 0,
      team2Pairs: 0,
    },
    currentTurn: 1,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or reset game
  const startNewGame = useCallback(
    (newMode = mode, newDifficulty = difficulty, newPlayerMode = playerMode) => {
      const generatedCards = generateGameCards(newMode, newDifficulty);
      const totalPairs = getPairsCountForDifficulty(newDifficulty);

      setCards(generatedCards);
      setFlippedCards([]);
      setIsProcessing(false);
      setIsVictoryOpen(false);
      setLastFeedback({ type: null, message: '' });

      setStats({
        score: 0,
        moves: 0,
        matchedPairs: 0,
        totalPairs,
        streak: 0,
        bestStreak: 0,
        timeSpent: 0,
        teamScores: {
          team1: 0,
          team2: 0,
          team1Pairs: 0,
          team2Pairs: 0,
        },
        currentTurn: 1,
      });

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setStats((prev) => ({
          ...prev,
          timeSpent: prev.timeSpent + 1,
        }));
      }, 1000);
    },
    [mode, difficulty, playerMode]
  );

  // Initial load
  useEffect(() => {
    startNewGame();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startNewGame]);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    sounds.setMuted(newMuted);
  };

  const handleTestApplause = () => {
    sounds.playApplause();
    setLastFeedback({
      type: 'correct',
      message: '👏 ALKIŞ TESTİ (DOĞRU CEVAP SESİ)',
    });
    setTimeout(() => {
      setLastFeedback({ type: null, message: '' });
    }, 2000);
  };

  const handleTestCrying = () => {
    sounds.playCrying();
    setLastFeedback({
      type: 'wrong',
      message: '😭 AĞLAMA TESTİ (YANLIŞ CEVAP SESİ)',
    });
    setTimeout(() => {
      setLastFeedback({ type: null, message: '' });
    }, 2000);
  };

  // Card click handler
  const handleCardClick = (clickedCard: GameCard) => {
    if (isProcessing || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    sounds.playCardFlip();

    // Flip card visually
    const newCards = cards.map((c) =>
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    // If this is the second card flipped
    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [card1, card2] = newFlipped;

      // Update Moves count
      setStats((prev) => ({
        ...prev,
        moves: prev.moves + 1,
      }));

      // Check Match
      const isMatch = card1.vocabId === card2.vocabId;

      if (isMatch) {
        // MATCH SUCCESS: Play APPLAUSE & CHEERS!
        sounds.playApplause();

        setLastFeedback({
          type: 'correct',
          message: '👏 HARİKA! DOĞRU EŞLEŞME! (+100 PUAN)',
        });

        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.vocabId === card1.vocabId
                ? { ...c, isFlipped: true, isMatched: true }
                : c
            )
          );

          setStats((prev) => {
            const newStreak = prev.streak + 1;
            const streakBonus = (newStreak - 1) * 50;
            const pointsEarned = 100 + streakBonus;
            const newMatchedPairs = prev.matchedPairs + 1;

            if (newStreak > 1) {
              sounds.playComboStreak(newStreak);
            }

            // Team Mode Scores
            const currentTurn = prev.currentTurn || 1;
            const updatedTeamScores = prev.teamScores
              ? {
                  ...prev.teamScores,
                  team1:
                    currentTurn === 1
                      ? prev.teamScores.team1 + pointsEarned
                      : prev.teamScores.team1,
                  team2:
                    currentTurn === 2
                      ? prev.teamScores.team2 + pointsEarned
                      : prev.teamScores.team2,
                  team1Pairs:
                    currentTurn === 1
                      ? prev.teamScores.team1Pairs + 1
                      : prev.teamScores.team1Pairs,
                  team2Pairs:
                    currentTurn === 2
                      ? prev.teamScores.team2Pairs + 1
                      : prev.teamScores.team2Pairs,
                }
              : undefined;

            const isGameComplete = newMatchedPairs >= prev.totalPairs;

            if (isGameComplete) {
              if (timerRef.current) {
                clearInterval(timerRef.current);
              }
              sounds.playGrandVictory();
              setIsVictoryOpen(true);
            }

            return {
              ...prev,
              score: prev.score + pointsEarned,
              matchedPairs: newMatchedPairs,
              streak: newStreak,
              bestStreak: Math.max(prev.bestStreak, newStreak),
              teamScores: updatedTeamScores,
              // In team mode, when you get it right, you keep your turn!
              currentTurn: prev.currentTurn,
            };
          });

          setFlippedCards([]);
          setIsProcessing(false);

          setTimeout(() => {
            setLastFeedback({ type: null, message: '' });
          }, 1500);
        }, 700);
      } else {
        // MATCH FAILED: Play CRYING / WAH-WAH SAD SOUND!
        sounds.playCrying();

        setLastFeedback({
          type: 'wrong',
          message: '😭 EŞLEŞMEDİ! (-20 PUAN)',
        });

        setTimeout(() => {
          // Flip both cards back
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === card1.id || c.id === card2.id
                ? { ...c, isFlipped: false }
                : c
            )
          );

          setStats((prev) => {
            const nextTurn = prev.currentTurn === 1 ? 2 : 1;
            const updatedScore = Math.max(0, prev.score - 20);

            // In team mode, pass the turn to the other team on error
            return {
              ...prev,
              score: updatedScore,
              streak: 0,
              currentTurn: nextTurn,
            };
          });

          setFlippedCards([]);
          setIsProcessing(false);

          setTimeout(() => {
            setLastFeedback({ type: null, message: '' });
          }, 1200);
        }, 1200);
      }
    }
  };

  const handleSelectMode = (newMode: GameMode) => {
    setMode(newMode);
    startNewGame(newMode, difficulty, playerMode);
  };

  const handleSelectDifficulty = (newDiff: Difficulty) => {
    setDifficulty(newDiff);
    startNewGame(mode, newDiff, playerMode);
  };

  const handleSelectPlayerMode = (newPMode: PlayerMode) => {
    setPlayerMode(newPMode);
    startNewGame(mode, difficulty, newPMode);
  };

  return (
    <div className="min-h-screen bg-[#FFDE59] text-black flex flex-col font-sans selection:bg-black selection:text-[#FFDE59]">
      {/* Top Score HUD */}
      <ScoreHeader
        stats={stats}
        playerMode={playerMode}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onRestart={() => startNewGame()}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onTestApplause={handleTestApplause}
        onTestCrying={handleTestCrying}
      />

      {/* Settings & Mode Toolbar */}
      <SettingsBar
        mode={mode}
        difficulty={difficulty}
        playerMode={playerMode}
        onSelectMode={handleSelectMode}
        onSelectDifficulty={handleSelectDifficulty}
        onSelectPlayerMode={handleSelectPlayerMode}
      />

      {/* Team Turn HUD if in 2-Player Team Mode */}
      {playerMode === 'team' && <TeamScoreboard stats={stats} />}

      {/* Live Feedback Notification Banner for Classroom Visibility */}
      {lastFeedback.type && (
        <div className="w-full max-w-2xl mx-auto px-4 z-20 my-1 animate-in slide-in-from-top-2 duration-200">
          <div
            className={`py-2.5 px-5 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
              lastFeedback.type === 'correct'
                ? 'bg-[#77D970] text-black'
                : 'bg-[#FF5757] text-white'
            }`}
          >
            {lastFeedback.type === 'correct' ? (
              <Smile className="w-6 h-6 text-black animate-spin" />
            ) : (
              <Frown className="w-6 h-6 text-white animate-bounce" />
            )}
            <span>{lastFeedback.message}</span>
          </div>
        </div>
      )}

      {/* Main Game Card Grid */}
      <GameBoard
        cards={cards}
        onCardClick={handleCardClick}
        disabled={isProcessing}
      />

      {/* Bottom Smart Board Hint Footer */}
      <footer className="w-full bg-white border-t-4 border-black py-2.5 px-4 text-center text-xs sm:text-sm text-black select-none shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-black font-black">
            <span className="bg-[#FFDE59] px-2 py-0.5 rounded border border-black">💡 Akıllı Tahta İpucu:</span>
            <span className="text-black font-bold">
              Kartlardaki 🔊 butonuna dokunarak İngilizce telaffuzu tüm sınıfla birlikte dinleyebilirsiniz.
            </span>
          </div>
          <div className="flex items-center gap-2 font-black text-black">
            <span className="bg-[#77D970] px-2 py-0.5 rounded border border-black">👏 Doğru = Alkış</span>
            <span>•</span>
            <span className="bg-[#FF5757] text-white px-2 py-0.5 rounded border border-black">😭 Yanlış = Ağlama</span>
          </div>
        </div>
      </footer>

      {/* Victory & Score Details Modal */}
      <GameModal
        isOpen={isVictoryOpen}
        stats={stats}
        playerMode={playerMode}
        onRestart={() => startNewGame()}
        onClose={() => setIsVictoryOpen(false)}
      />
    </div>
  );
}
