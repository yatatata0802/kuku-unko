import React, { useState, useEffect } from 'react';
import { KukuItem, PracticeType, Progress, WeakQuestion } from '../types';
import { generateRowQuestions, shuffleArray, getKukuChantQuestion } from '../data/kukuData';
import { Play, ArrowLeft, RefreshCw, Trophy, Star, Sparkles, Volume2, HelpCircle, ArrowRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playPopSound, playCorrectSound, playWrongSound, playVictorySound, speakChant } from '../utils/audio';

interface PracticeModeProps {
  progress: Progress;
  onUpdateProgress: (newProgress: Progress) => void;
  onAddWeakQuestion: (multiplicand: number, multiplier: number) => void;
  onBackToDashboard: () => void;
  selectedDan: number;
  initialType: PracticeType;
}

export default function PracticeMode({
  progress,
  onUpdateProgress,
  onAddWeakQuestion,
  onBackToDashboard,
  selectedDan,
  initialType
}: PracticeModeProps) {
  const [questions, setQuestions] = useState<KukuItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizState, setQuizState] = useState<'intro' | 'playing' | 'feedback' | 'finished'>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongThisRun, setWrongThisRun] = useState<KukuItem[]>([]);
  const [choices, setChoices] = useState<number[]>([]);

  // Time measurement states
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);

  // Sound play simulation text
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);

  // Load best time on select
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kuku_best_times');
      if (stored) {
        const bestTimes = JSON.parse(stored);
        const danBest = bestTimes[selectedDan.toString()];
        if (danBest && danBest[initialType] !== undefined) {
          setBestTime(danBest[initialType]);
        } else {
          setBestTime(null);
        }
      } else {
        setBestTime(null);
      }
      setIsNewBest(false);
    } catch (e) {
      console.error(e);
    }
  }, [selectedDan, initialType]);

  // Keep tracking time when the user is actively playing
  useEffect(() => {
    let interval: any;
    if (quizState === 'playing') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizState]);

  // Reset or initialize state
  useEffect(() => {
    let qList = generateRowQuestions(selectedDan);
    if (initialType === 'shuffle') {
      qList = shuffleArray(qList);
    }
    setQuestions(qList);
    setCurrentIndex(0);
    setScore(0);
    setWrongThisRun([]);
    setElapsedTime(0);
    setIsNewBest(false);
    setQuizState('intro');
  }, [selectedDan, initialType]);

  // Set up choices for current question
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      const q = questions[currentIndex];
      const correct = q.answer;
      
      const potentialChoices = new Set<number>();
      potentialChoices.add(correct);

      // Add common mistakes
      // 1. Adding instead of multiplying
      potentialChoices.add(q.multiplicand + q.multiplier);
      // 2. Neighboring multiplications
      if (q.multiplier > 1) potentialChoices.add(q.multiplicand * (q.multiplier - 1));
      if (q.multiplier < 9) potentialChoices.add(q.multiplicand * (q.multiplier + 1));
      // 3. Reversed digits or general kuku errors
      potentialChoices.add((q.multiplicand + 1) * q.multiplier);
      potentialChoices.add(Math.max(1, q.multiplicand - 1) * q.multiplier);

      // Pad with random sensible values around the correct answer
      while (potentialChoices.size < 4) {
        const offset = Math.floor(Math.random() * 10) - 5;
        const randChoice = correct + offset;
        if (randChoice > 0 && randChoice <= 81) {
          potentialChoices.add(randChoice);
        }
      }

      setChoices(shuffleArray(Array.from(potentialChoices)));
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      // For sequential mode, guide with hint by default, for random hide it
      setShowHint(initialType === 'order');
    }
  }, [questions, currentIndex, initialType]);

  const handleAnswerSubmit = (ans: number) => {
    if (selectedAnswer !== null) return; // Already answered
    
    setSelectedAnswer(ans);
    const q = questions[currentIndex];
    const isCorrect = ans === q.answer;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setSoundFeedback('🎉 ぷにっ！大せいかい！💩');
      playCorrectSound();
      speakChant(q.chant);
    } else {
      setWrongThisRun(prev => [...prev, q]);
      onAddWeakQuestion(q.multiplicand, q.multiplier);
      setSoundFeedback('💩 うんこパワーでのりこえよう！');
      playWrongSound();
      speakChant(`${q.multiplicand}かける${q.multiplier}は、${q.answer}`);
    }

    setQuizState('feedback');
    // Speak aloud chant simulation
    setTimeout(() => {
      setSoundFeedback(isCorrect ? `🟢 正解！「${q.chant}」` : `🔴 ざんねん！「${q.chant}」`);
    }, 800);
  };

  const handleNextQuestion = () => {
    playPopSound();
    setSoundFeedback(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setQuizState('playing');
    } else {
      // Finished!
      setQuizState('finished');
      saveProgress();
    }
  };

  const saveProgress = () => {
    const finalScore = score + (isAnswerCorrect ? 1 : 0); // Include final answer if correct
    const finalTime = elapsedTime;

    try {
      if (finalScore === 9) {
        playVictorySound();
      } else {
        playPopSound();
      }

      const stored = localStorage.getItem('kuku_best_times');
      const bestTimes = stored ? JSON.parse(stored) : {};
      const danKey = selectedDan.toString();
      if (!bestTimes[danKey]) {
        bestTimes[danKey] = {};
      }
      const prevBest = bestTimes[danKey][initialType];
      if (prevBest === undefined || finalTime < prevBest) {
        bestTimes[danKey][initialType] = finalTime;
        localStorage.setItem('kuku_best_times', JSON.stringify(bestTimes));
        setBestTime(finalTime);
        setIsNewBest(true);
      }

      // Record count milestones & special achievements
      const curPlayCount = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      localStorage.setItem('kuku_play_count', (curPlayCount + 1).toString());

      if (finalScore === 9) {
        const curPerfectCount = parseInt(localStorage.getItem('kuku_perfect_count') || '0', 10);
        localStorage.setItem('kuku_perfect_count', (curPerfectCount + 1).toString());

        // Mark individual dan as perfect
        localStorage.setItem('kuku_perfect_dan_' + selectedDan, 'true');

        if (selectedDan === 7 && initialType === 'shuffle') {
          localStorage.setItem('kuku_lucky_seven_perfect', 'true');
        }
        if (selectedDan === 9) {
          localStorage.setItem('kuku_dan9_perfect', 'true');
        }

        // consecutive perfects
        const prevConsec = parseInt(localStorage.getItem('kuku_consecutive_perfect') || '0', 10);
        const nextConsec = prevConsec + 1;
        localStorage.setItem('kuku_consecutive_perfect', nextConsec.toString());
        const maxConsec = parseInt(localStorage.getItem('kuku_max_consecutive_perfect') || '0', 10);
        if (nextConsec > maxConsec) {
          localStorage.setItem('kuku_max_consecutive_perfect', nextConsec.toString());
        }
      } else {
        localStorage.setItem('kuku_consecutive_perfect', '0');
      }

      const hour = new Date().getHours();
      if (hour < 10) {
        localStorage.setItem('kuku_completed_morning', 'true');
      }
      if (hour >= 17) {
        localStorage.setItem('kuku_completed_evening', 'true');
      }
      if (hour >= 21) {
        localStorage.setItem('kuku_completed_night', 'true');
      }

    } catch (e) {
      console.error(e);
    }

    const newProgress = { ...progress };
    const rowProgress = newProgress[selectedDan] || {
      unlocked: true,
      orderMastered: false,
      shuffleMastered: false,
      stars: 0,
      highScore: 0
    };

    if (initialType === 'order') {
      rowProgress.orderMastered = true;
      rowProgress.stars = Math.max(rowProgress.stars, 1);
      // Automatically unlock the next Dan!
      if (selectedDan < 9) {
        if (!newProgress[selectedDan + 1]) {
          newProgress[selectedDan + 1] = {
            unlocked: true,
            orderMastered: false,
            shuffleMastered: false,
            stars: 0,
            highScore: 0
          };
        } else {
          newProgress[selectedDan + 1].unlocked = true;
        }
      }
    } else if (initialType === 'shuffle') {
      rowProgress.shuffleMastered = true;
      rowProgress.stars = Math.max(rowProgress.stars, 2);
      if (wrongThisRun.length === 0) {
        rowProgress.stars = 3; // Perfect score on random mode gets 3 stars!
      }
    }

    newProgress[selectedDan] = rowProgress;
    onUpdateProgress(newProgress);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-emerald-300" id="practice-layout">
      {/* 行ヘッダー */}
      <div className="bg-gradient-to-r from-emerald-400 to-green-500 p-4 md:p-6 text-white flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="bg-emerald-600/40 hover:bg-emerald-600/60 transition-all font-bold px-3 py-1.5 rounded-xl text-xs md:text-sm flex items-center gap-1.5"
          id="btn-return-dashboard"
        >
          <ArrowLeft className="w-4 h-4" /> もどる
        </button>
        <div className="text-center">
          <span className="bg-white/20 text-xs font-bold px-2.5 py-1 rounded-full">{selectedDan}のだん</span>
          <h1 className="text-lg md:text-2xl font-bold font-kids mt-1">
            {initialType === 'order' ? '「じゅんばん」れんしゅう' : '「バラバラ」クイズ'}
          </h1>
        </div>
        <div className="w-16"></div> {/* spacer */}
      </div>

      {quizState === 'intro' && (
        <div className="p-6 md:p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-200">
            <Play className="w-12 h-12 text-emerald-500 fill-emerald-500 ml-1.5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-kids text-gray-800">
            {selectedDan}のだん の れんしゅうを はじめよう！
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            {initialType === 'order'
              ? '1から 9まで じゅんばんに もんだいが出るよ。声に出して「となえながら」おぼえていこう！'
              : 'もんだいが バラバラに出るよ。ぜんぶ正解（せいかい）して、★みっつ（満点）をめざそう！'}
          </p>

          <button
            onClick={() => setQuizState('playing')}
            className="mt-8 bg-amber-400 hover:bg-amber-500 hover:scale-105 active:scale-95 text-amber-950 font-bold font-kids text-lg px-8 py-4 rounded-2xl shadow-lg border-b-4 border-amber-600 transition-all cursor-pointer"
            id="start-button-id"
          >
            スタート！ 🚀
          </button>
        </div>
      )}

      {quizState === 'playing' && currentQuestion && (
        <div className="p-4 md:p-8 flex flex-col justify-between min-h-[420px]">
          {/* メーターとスコア */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                もんだい {currentIndex + 1} / {questions.length}
              </span>
              {/* 薄い色のひっそりタイマー */}
              <span className="text-[10px] text-gray-300 font-mono pointer-events-none select-none flex items-center gap-0.5">
                ⏱️ {elapsedTime}s
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-gray-700">せいかい: {score}</span>
            </div>
          </div>

          {/* 進捗バー */}
          <div className="h-2 w-full bg-gray-100 rounded-full mb-6">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* 左側：問題ディスプレイ */}
            <div className="md:col-span-7 bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-100 flex flex-col items-center justify-center min-h-[200px] shadow-sm relative">
              <div className="text-5xl md:text-6xl font-extrabold font-mono text-emerald-800 tracking-wide flex items-center gap-3">
                <span>{currentQuestion.multiplicand}</span>
                <span className="text-3xl md:text-4xl text-emerald-400">×</span>
                <span>{currentQuestion.multiplier}</span>
                <span className="text-3xl md:text-4xl text-emerald-400">=</span>
                <span className="text-gray-300 border-b-4 border-dashed border-gray-400 px-4">?</span>
              </div>

              {/* となえかたヒント */}
              <div className="mt-5 bg-white/90 border border-emerald-200 rounded-2xl px-5 py-3 flex flex-col items-center shadow-xs max-w-xs w-full">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> こえにだして となえてみよう！
                </span>
                <span className="text-xl md:text-2xl font-bold font-kids text-amber-600 mt-1 tracking-wider">
                  「{getKukuChantQuestion(currentQuestion.chantDisplay, true)}」
                </span>
                <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                  ({getKukuChantQuestion(currentQuestion.chantDisplay, false)})
                </span>
              </div>

              {/* ヒントボタン */}
              {initialType === 'shuffle' && !showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="mt-6 text-xs text-emerald-600 hover:text-emerald-700 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm font-medium"
                >
                  <HelpCircle className="w-4 h-4" /> うんこのえ を見る💩（ヒント）
                </button>
              )}

              {/* くだものの絵ビジュアル */}
              {showHint && (
                <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-full">
                  {Array.from({ length: currentQuestion.multiplier }).map((_, gIdx) => (
                    <div key={gIdx} className="bg-white p-1.5 rounded-lg border border-emerald-100 flex items-center justify-center gap-0.5 shadow-sm">
                      {Array.from({ length: currentQuestion.multiplicand }).map((_, iIdx) => (
                        <span key={iIdx} className="text-base">💩</span>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 右側：回答選択肢 */}
            <div className="md:col-span-5 flex flex-col justify-center h-full">
              <h3 className="text-sm font-bold text-gray-500 mb-3 text-center md:text-left">
                ただしい こたえは どれかな？
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {choices.map((num) => (
                  <button
                    key={num}
                    id={`choice-${num}`}
                    onClick={() => handleAnswerSubmit(num)}
                    className="aspect-video sm:aspect-auto sm:py-5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 hover:scale-[1.02] text-white rounded-2xl text-2xl font-extrabold font-mono border-b-4 border-emerald-800 transition-all shadow-md flex items-center justify-center"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {quizState === 'feedback' && currentQuestion && (
        <div className="p-4 md:p-8 flex flex-col justify-between min-h-[420px]" id="feedback-panel">
          <div className="text-center">
            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
              もんだい {currentIndex + 1} / {questions.length} の こたえあわせ
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-6">
            {/* 丸バツビジュアル */}
            <div className="mb-4">
              {isAnswerCorrect ? (
                <motion.div
                  initial={{ scale: 0.5, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="bg-amber-100 rounded-full p-4 border-4 border-amber-400"
                >
                  <Trophy className="w-16 h-16 text-amber-500 animate-bounce" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-rose-100 rounded-full p-4 border-4 border-rose-400"
                >
                  <Heart className="w-16 h-16 text-rose-500" />
                </motion.div>
              )}
            </div>

            {/* 音のテキスト擬似音声 */}
            {soundFeedback && (
              <div className="bg-sky-50 text-sky-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 mb-4 ring-2 ring-sky-300 animate-pulse">
                <Volume2 className="w-4 h-4 text-sky-500" />
                {soundFeedback}
              </div>
            )}

            {/* 正しい式の表示 */}
            <div className="text-center mb-6">
              <div className="text-4xl md:text-5xl font-extrabold font-mono text-gray-800 tracking-wide">
                {currentQuestion.multiplicand} × {currentQuestion.multiplier} ={' '}
                <span className="text-emerald-500 font-bold underline decoration-wavy decoration-yellow-400">
                  {currentQuestion.answer}
                </span>
              </div>

              {/* となえかたルビ表示 */}
              <div className="mt-4 bg-amber-50 px-6 py-3 rounded-2xl inline-block border-2 border-amber-200 shadow-md">
                <span className="text-xs font-bold text-amber-600 block mb-1">
                  こえに出して ３回（かい）となえよう！ 🗣️
                </span>
                <ruby className="text-2xl font-extrabold font-kids tracking-wider text-amber-900 block mt-1">
                  {currentQuestion.chant}
                </ruby>
              </div>
            </div>

            {/* なぜそうなる？ */}
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 max-w-lg text-xs text-emerald-800">
              <span className="font-bold block mb-1">⭐ おぼえかたのヒント</span>
              {currentQuestion.multiplicand} が {currentQuestion.multiplier} 個（こ）あるから、たし算すると{' '}
              {Array.from({ length: currentQuestion.multiplier })
                .map(() => currentQuestion.multiplicand)
                .join('+')}{' '}
              = {currentQuestion.answer} になるね！
            </div>
          </div>

          {/* 次へボタン */}
          <div className="flex justify-center">
            <button
              onClick={handleNextQuestion}
              className="bg-amber-400 hover:bg-amber-500 hover:scale-105 text-amber-950 font-extrabold font-kids text-lg px-10 py-4 rounded-2xl shadow-md border-b-4 border-amber-600 transition-all cursor-pointer flex items-center gap-2"
              id="next-question-btn"
            >
              つぎの もんだいへ <ArrowRight className="w-5 h-5 text-amber-950" />
            </button>
          </div>
        </div>
      )}

      {quizState === 'finished' && (
        <div className="p-6 md:p-10 text-center flex flex-col items-center justify-center min-h-[400px]" id="finish-panel">
          <div className="relative">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="bg-yellow-100 rounded-full p-6 border-4 border-yellow-400 mb-6"
            >
              <Trophy className="w-20 h-20 text-yellow-500 animate-bounce" />
            </motion.div>
            <div className="absolute top-0 right-0 animate-pulse text-2xl">✨</div>
            <div className="absolute bottom-4 left-0 animate-pulse text-2xl">💖</div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-kids text-amber-600">
            おめでとう！ クリアしたよ！ 🎉
          </h2>
          <p className="text-sm font-bold text-gray-500 mt-2">
            きみのスコア:{' '}
            <span className="text-2xl font-mono font-extrabold text-emerald-600">
              {score} / {questions.length}
            </span>
          </p>

          {/* タイム表示（しれっと表示） */}
          <div className="mt-2 text-xs text-gray-400 font-sans flex flex-col items-center gap-0.5 opacity-70">
            <span className="flex items-center gap-1">⏱️ クリアタイム: {elapsedTime}秒</span>
            {bestTime !== null && (
              <span className="text-[10px] text-gray-400">
                {isNewBest ? '✨ ベストタイムを こうしんしたよ！' : `(ベストタイム: ${bestTime}秒)`}
              </span>
            )}
          </div>

          {/* シール獲得演出 */}
          {wrongThisRun.length === 0 ? (
            <div className="mt-4 bg-yellow-50 px-5 py-3 rounded-2xl border border-yellow-200 inline-flex items-center gap-2 text-yellow-800 text-sm font-bold shadow-md">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span>パーフェクト！ めずらしいシールをもらったよ！「シールちょう」をみてね！</span>
            </div>
          ) : (
            <div className="mt-4 bg-sky-50 px-5 py-3 rounded-2xl border border-sky-200 inline-flex items-center gap-2 text-sky-800 text-sm font-medium shadow-md">
              <Heart className="w-5 h-5 text-pink-400" />
              <span>がんばったね！ まちがえた もんだいは「にがてクリア」に登録されたよ。</span>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => {
                let qList = generateRowQuestions(selectedDan);
                if (initialType === 'shuffle') {
                  qList = shuffleArray(qList);
                }
                setQuestions(qList);
                setCurrentIndex(0);
                setScore(0);
                setWrongThisRun([]);
                setQuizState('playing');
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-xl flex items-center gap-1 transition-all border border-gray-300"
            >
              <RefreshCw className="w-4 h-4" /> もういちど
            </button>

            <button
              onClick={onBackToDashboard}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold font-kids px-10 py-3 rounded-xl shadow-md transition-all text-lg"
              id="dash-finish-btn"
            >
              ひろば（メニュー）にもどる 🏠
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
