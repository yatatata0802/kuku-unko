import React, { useState, useEffect } from 'react';
import { KukuItem, Progress } from '../types';
import { getKukuItem, shuffleArray, getKukuChantQuestion } from '../data/kukuData';
import { ArrowLeft, Clock, Star, Trophy, Volume2, RefreshCw, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { playPopSound, playCorrectSound, playWrongSound, playVictorySound, speakChant } from '../utils/audio';

interface ChallengeModeProps {
  progress: Progress;
  onUpdateProgress: (newProgress: Progress) => void;
  onAddWeakQuestion: (multiplicand: number, multiplier: number) => void;
  onBackToDashboard: () => void;
}

export default function ChallengeMode({
  progress,
  onUpdateProgress,
  onAddWeakQuestion,
  onBackToDashboard
}: ChallengeModeProps) {
  const [questions, setQuestions] = useState<KukuItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizState, setQuizState] = useState<'intro' | 'playing' | 'feedback' | 'finished'>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);

  // Entire overall time measurement
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  
  // Speed points calculation
  const [timeRemaining, setTimeRemaining] = useState(10); // 10 seconds per question
  const [timerActive, setTimerActive] = useState(false);
  const [wrongThisRun, setWrongThisRun] = useState<KukuItem[]>([]);
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);

  // Load best challenge overall clear-time
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kuku_best_times');
      if (stored) {
        const bestTimes = JSON.parse(stored);
        if (bestTimes['challenge'] !== undefined) {
          setBestTime(bestTimes['challenge']);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Soft covert continuous overall timer, only active while actually playing
  useEffect(() => {
    let interval: any;
    if (quizState === 'playing') {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizState]);

  // Pick questions from all unlocked Dans
  const generateChallengeQuestions = () => {
    // Collect all unlocked rows
    const unlockedDans = Object.keys(progress)
      .map(Number)
      .filter((dan) => progress[dan]?.unlocked);

    let baseDans = unlockedDans.length > 0 ? unlockedDans : [1, 2];

    // Pick 10 random unique kuku formulas
    const allPossibleCalculations: KukuItem[] = [];
    baseDans.forEach((dan) => {
      for (let i = 1; i <= 9; i++) {
        allPossibleCalculations.push(getKukuItem(dan, i));
      }
    });

    const randomized = shuffleArray(allPossibleCalculations);
    return randomized.slice(0, 10);
  };

  const handleStartChallenge = () => {
    const qList = generateChallengeQuestions();
    setQuestions(qList);
    setCurrentIndex(0);
    setScore(0);
    setWrongThisRun([]);
    setElapsedTime(0);
    setIsNewBest(false);
    setQuizState('playing');
    setTimeRemaining(10);
    setTimerActive(true);
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && quizState === 'playing') {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, quizState, currentIndex]);

  const handleTimeOut = () => {
    setTimerActive(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(false);
    const q = questions[currentIndex];
    setWrongThisRun((prev) => [...prev, q]);
    onAddWeakQuestion(q.multiplicand, q.multiplier);
    setSoundFeedback('⏰ うわーっ！うんこタイムアウト！💦💩');
    playWrongSound();
    speakChant(`タイムアウト！こたえは、${q.answer}`);
    setQuizState('feedback');
  };

  // Determine choices for current question
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length && quizState === 'playing') {
      const q = questions[currentIndex];
      const correct = q.answer;
      const potentialChoices = new Set<number>();
      potentialChoices.add(correct);

      // Distractors
      potentialChoices.add(q.multiplicand + q.multiplier);
      if (q.multiplier > 1) potentialChoices.add(q.multiplicand * (q.multiplier - 1));
      if (q.multiplier < 9) potentialChoices.add(q.multiplicand * (q.multiplier + 1));
      
      // Random wrong kuku
      const otherDan = Math.ceil(Math.random() * 9);
      const otherMul = Math.ceil(Math.random() * 9);
      potentialChoices.add(otherDan * otherMul);

      while (potentialChoices.size < 4) {
        const offset = Math.floor(Math.random() * 8) - 4;
        const val = correct + offset;
        if (val > 0 && val <= 81) potentialChoices.add(val);
      }

      setChoices(shuffleArray(Array.from(potentialChoices)));
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setTimeRemaining(10);
      setTimerActive(true);
    }
  }, [questions, currentIndex, quizState]);

  const handleAnswerSubmit = (ans: number) => {
    if (selectedAnswer !== null) return;
    
    setTimerActive(false);
    setSelectedAnswer(ans);
    const q = questions[currentIndex];
    const isCorrect = ans === q.answer;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setSoundFeedback('🎉 すばらしいっ！ぷにぷにせいかい！💩');
      playCorrectSound();
      speakChant(q.chant);
    } else {
      setWrongThisRun((prev) => [...prev, q]);
      onAddWeakQuestion(q.multiplicand, q.multiplier);
      setSoundFeedback(`💩 ドンマイ！となえてうんこパワーをためよう！ 「${q.chant}」`);
      playWrongSound();
      speakChant(`${q.multiplicand}かける${q.multiplier}は、${q.answer}`);
    }

    setQuizState('feedback');
  };

  const handleNext = () => {
    playPopSound();
    setSoundFeedback(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setQuizState('playing');
    } else {
      setQuizState('finished');
      saveChallengeProgress();
    }
  };

  const saveChallengeProgress = () => {
    // If they score perfectly (10/10), we mark progress
    const finalScore = score + (isAnswerCorrect ? 1 : 0);
    if (finalScore === 10) {
      playVictorySound();
      // Perfect score can trigger special accomplishments. We'll save score in LocalStorage in App.tsx
      localStorage.setItem('kuku_perfect_challenge', 'true');
    } else {
      playPopSound();
    }

    const finalTime = elapsedTime;
    try {
      const stored = localStorage.getItem('kuku_best_times');
      const bestTimes = stored ? JSON.parse(stored) : {};
      const prevBest = bestTimes['challenge'];
      if (prevBest === undefined || finalTime < prevBest) {
        bestTimes['challenge'] = finalTime;
        localStorage.setItem('kuku_best_times', JSON.stringify(bestTimes));
        setBestTime(finalTime);
        setIsNewBest(true);
      }

      // Record play count & perfect counts for the expanded sticker book
      const curPlayCount = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      localStorage.setItem('kuku_play_count', (curPlayCount + 1).toString());

      if (finalScore === 10) {
        const curPerfectCount = parseInt(localStorage.getItem('kuku_perfect_count') || '0', 10);
        localStorage.setItem('kuku_perfect_count', (curPerfectCount + 1).toString());

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

      // challenge high score & play count
      const currentBest = parseInt(localStorage.getItem('kuku_challenge_best_score') || '0', 10);
      if (finalScore > currentBest) {
        localStorage.setItem('kuku_challenge_best_score', finalScore.toString());
      }
      const challengePlays = parseInt(localStorage.getItem('kuku_challenge_completed_count') || '0', 10);
      localStorage.setItem('kuku_challenge_completed_count', (challengePlays + 1).toString());

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
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-yellow-300" id="challenge-layout">
      {/* 行ヘッダー */}
      <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-4 md:p-6 text-white flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="bg-amber-600/40 hover:bg-amber-600/60 transition-all font-bold px-3 py-1.5 rounded-xl text-xs md:text-sm flex items-center gap-1.5"
          id="btn-challenge-back"
        >
          <ArrowLeft className="w-4 h-4" /> もどる
        </button>
        <div className="text-center">
          <span className="bg-white/20 text-xs font-bold px-2.5 py-1 rounded-full">とくべつチャレンジ</span>
          <h1 className="text-lg md:text-2xl font-bold font-kids mt-1">⚔️ ちからだめし</h1>
        </div>
        <div className="w-16"></div>
      </div>

      {quizState === 'intro' && (
        <div className="p-6 md:p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6 border-2 border-amber-200">
            <Trophy className="w-12 h-12 text-amber-500 animate-pulse" />
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold font-kids text-amber-700">
            ごうけい10問のにがて・ミックスクイズ！
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
            これまで あいた（クリアした）すべての段から、ランダムで10問でるよ！<br />
            <strong>1問につき10秒</strong>の タイムアタックだ！いそいで全問正解しよう！
          </p>

          <button
            onClick={handleStartChallenge}
            className="mt-8 bg-amber-400 hover:bg-amber-500 hover:scale-105 active:scale-95 text-amber-950 font-bold font-kids text-lg px-8 py-4 rounded-2xl shadow-lg border-b-4 border-amber-600 transition-all cursor-pointer"
            id="challenge-start-btn"
          >
            ちょうせんする！ 🔥
          </button>
        </div>
      )}

      {quizState === 'playing' && currentQuestion && (
        <div className="p-4 md:p-8 flex flex-col justify-between min-h-[420px]" id="playing-panel">
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
            {/* カウントダウンタイマー */}
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1 rounded-xl">
              <Clock className="w-4 h-4 text-rose-500 animate-spin-slow" />
              <span className="font-mono font-bold text-sm">あと {timeRemaining} 秒</span>
            </div>
          </div>

          {/* タイマービジュアルバー */}
          <div className="h-2.5 w-full bg-gray-100 rounded-full mb-6 relative overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timeRemaining <= 3 ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'
              }`}
              style={{ width: `${(timeRemaining / 10) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* 左側：問題ディスプレイ */}
            <div className="md:col-span-7 bg-amber-50 rounded-2xl p-6 border-2 border-amber-200 flex flex-col items-center justify-center min-h-[180px] shadow-sm relative">
              <div className="text-5xl md:text-6xl font-extrabold font-mono text-amber-900 tracking-wide flex items-center gap-3">
                <span>{currentQuestion.multiplicand}</span>
                <span className="text-3xl md:text-4xl text-amber-400">×</span>
                <span>{currentQuestion.multiplier}</span>
                <span className="text-3xl md:text-4xl text-amber-400">=</span>
                <span className="text-gray-300 border-b-4 border-dashed border-gray-400 px-4">?</span>
              </div>

              {/* となえかたヒント */}
              <div className="mt-5 bg-white/90 border border-amber-200 rounded-2xl px-5 py-3 flex flex-col items-center shadow-xs max-w-xs w-full">
                <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> となえて タイムアップをふせごう！
                </span>
                <span className="text-xl md:text-2xl font-bold font-kids text-amber-600 mt-1 tracking-wider">
                  「{getKukuChantQuestion(currentQuestion.chantDisplay, true)}」
                </span>
                <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                  ({getKukuChantQuestion(currentQuestion.chantDisplay, false)})
                </span>
              </div>
            </div>

            {/* 右側：回答選択肢 */}
            <div className="md:col-span-5 flex flex-col justify-center">
              <h3 className="text-sm font-bold text-gray-400 mb-3 text-center md:text-left">
                じかん内に こたえてね！
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {choices.map((num) => (
                  <button
                    key={num}
                    id={`challenge-choice-${num}`}
                    onClick={() => handleAnswerSubmit(num)}
                    className="aspect-video sm:aspect-auto sm:py-5 bg-amber-500 hover:bg-amber-400 active:scale-95 hover:scale-[1.02] text-white rounded-2xl text-2xl font-extrabold font-mono border-b-4 border-amber-700 transition-all shadow-md flex items-center justify-center"
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
        <div className="p-4 md:p-8 flex flex-col justify-between min-h-[420px]" id="result-check">
          <div className="text-center">
            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
              もんだい {currentIndex + 1} / {questions.length} の結果（けっか）
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <div className="mb-4">
              {isAnswerCorrect ? (
                <div className="bg-amber-100 rounded-full p-4 border-4 border-amber-400">
                  <Star className="w-16 h-16 text-amber-500 animate-spin" />
                </div>
              ) : (
                <div className="bg-rose-100 rounded-full p-4 border-4 border-rose-400">
                  <Heart className="w-16 h-16 text-rose-400" />
                </div>
              )}
            </div>

            {/* 音のテキスト */}
            {soundFeedback && (
              <div className="bg-amber-50 text-amber-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 mb-4 ring-2 ring-amber-300 animate-pulse">
                <Volume2 className="w-4 h-4 text-amber-500" />
                {soundFeedback}
              </div>
            )}

            <div className="text-center mb-6">
              <div className="text-4xl md:text-5xl font-extrabold font-mono text-gray-800 tracking-wide">
                {currentQuestion.multiplicand} × {currentQuestion.multiplier} ={' '}
                <span className="text-amber-500 font-bold underline decoration-wavy decoration-yellow-400">
                  {currentQuestion.answer}
                </span>
              </div>

              {/* となえかた */}
              <div className="mt-4 bg-yellow-50 px-6 py-3 rounded-2xl inline-block border-2 border-yellow-200 shadow-md">
                <span className="text-xs font-bold text-amber-600 block mb-1">となえかたの確認</span>
                <ruby className="text-2xl font-extrabold font-kids text-amber-900 tracking-wider">
                  {currentQuestion.chant}
                </ruby>
              </div>
            </div>
          </div>

          {/* 次へボタン */}
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className="bg-amber-400 hover:bg-amber-500 hover:scale-105 text-amber-950 font-extrabold font-kids text-lg px-10 py-4 rounded-2xl shadow-md border-b-4 border-amber-600 transition-all cursor-pointer"
              id="challenge-next-btn"
            >
              次へすすむ ➔
            </button>
          </div>
        </div>
      )}

      {quizState === 'finished' && (
        <div className="p-6 md:p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="bg-yellow-100 rounded-full p-6 border-4 border-yellow-400 mb-6 relative">
            <Trophy className="w-20 h-20 text-yellow-500 animate-bounce" />
            <div className="absolute top-0 right-0 animate-pulse text-2xl">✨</div>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold font-kids text-amber-600">
            ちからだめし 終了（しゅうりょう）！
          </h2>
          <p className="text-sm font-bold text-gray-600 mt-2">
            クリアもんだい数: <span className="text-2xl font-mono font-extrabold text-amber-600">{score} / 10</span>
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

          {score === 10 ? (
            <div className="mt-4 bg-yellow-50 px-5 py-3 rounded-2xl border border-yellow-300 inline-flex items-center gap-2 text-yellow-800 text-sm font-bold shadow-md">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span>おめでとう！九九のマスターに認定されました！スタンプが追加されたよ！</span>
            </div>
          ) : (
            <div className="mt-4 bg-pink-50 px-5 py-3 rounded-2xl border border-pink-200 inline-flex items-center gap-2 text-pink-700 text-sm font-bold shadow-md">
              <Heart className="w-5 h-5 text-pink-500 animate-pulse" />
              <span>おしい！まちがえちゃったら 「にがてこくふく」を がんばってみよう！</span>
            </div>
          )}

          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={handleStartChallenge}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-xl flex items-center gap-1 transition-all border border-gray-300"
            >
              <RefreshCw className="w-4 h-4" /> もう一度
            </button>

            <button
              onClick={onBackToDashboard}
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold font-kids px-10 py-3 rounded-xl shadow-md transition-all text-lg border-b-4 border-amber-600"
              id="challenge-finish-back-btn"
            >
              メニューにもどる 🏠
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
