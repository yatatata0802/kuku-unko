import React, { useState } from 'react';
import { WeakQuestion, KukuItem } from '../types';
import { getKukuItem, shuffleArray, getKukuChantQuestion } from '../data/kukuData';
import { Sparkles, Trophy, Heart, RefreshCw, Volume2, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { playPopSound, playCorrectSound, playWrongSound, playVictorySound, speakChant } from '../utils/audio';

interface WeakPointsProps {
  weakQuestions: WeakQuestion[];
  onRemoveWeakQuestion: (multiplicand: number, multiplier: number) => void;
  onClearAllWeak: () => void;
  onRefreshWeakList: () => void;
}

export default function WeakPoints({
  weakQuestions,
  onRemoveWeakQuestion,
  onClearAllWeak,
  onRefreshWeakList
}: WeakPointsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<KukuItem[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [choices, setChoices] = useState<number[]>([]);
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const startReviewSession = () => {
    if (weakQuestions.length === 0) return;
    
    playPopSound();
    // Convert WeakQuestion properties into rich KukuItems
    const richList = weakQuestions.map((wq) => getKukuItem(wq.multiplicand, wq.multiplier));
    const randomSession = shuffleArray(richList);
    
    setSessionQuestions(randomSession);
    setCurrentIndex(0);
    setScore(0);
    setIsPlaying(true);
    setupQuestion(randomSession[0]);
  };

  const setupQuestion = (q: KukuItem) => {
    const correct = q.answer;
    const potentialChoices = new Set<number>();
    potentialChoices.add(correct);
    
    potentialChoices.add(q.multiplicand + q.multiplier);
    if (q.multiplier > 1) potentialChoices.add(q.multiplicand * (q.multiplier - 1));
    if (q.multiplier < 9) potentialChoices.add(q.multiplicand * (q.multiplier + 1));
    
    // Add variations
    potentialChoices.add((q.multiplicand + 1) * q.multiplier);
    potentialChoices.add((q.multiplicand - 1) * q.multiplier);

    while (potentialChoices.size < 4) {
      const offset = Math.floor(Math.random() * 8) - 4;
      const v = correct + offset;
      if (v > 0) potentialChoices.add(v);
    }

    setChoices(shuffleArray(Array.from(potentialChoices)));
    setSelectedAnswer(null);
    setIsCorrect(null);
    setSoundFeedback(null);
  };

  const handleAnswer = (ans: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(ans);
    const q = sessionQuestions[currentIndex];
    const isAnsCorrect = ans === q.answer;
    setIsCorrect(isAnsCorrect);

    if (isAnsCorrect) {
      setScore((prev) => prev + 1);
      setSoundFeedback('🎉 すばらしい！うんのようにスッキリこくふく！💩');
      playCorrectSound();
      speakChant(q.chant);
      try {
        const curWeakClearedCount = parseInt(localStorage.getItem('kuku_weak_cleared_count') || '0', 10);
        localStorage.setItem('kuku_weak_cleared_count', (curWeakClearedCount + 1).toString());
      } catch (e) {
        console.error(e);
      }
      // Remove or decrease count of this weak question in state
      onRemoveWeakQuestion(q.multiplicand, q.multiplier);
    } else {
      setSoundFeedback(`😢 おしい！となえかた:「${q.chant}」`);
      playWrongSound();
      speakChant(`${q.multiplicand}かける${q.multiplier}は、${q.answer}`);
    }
  };

  const nextQuestion = () => {
    playPopSound();
    if (currentIndex + 1 < sessionQuestions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setupQuestion(sessionQuestions[nextIdx]);
    } else {
      setIsPlaying(false);
      onRefreshWeakList();
      playVictorySound();
    }
  };

  const currentQ = sessionQuestions[currentIndex];

  if (isPlaying && currentQ) {
    return (
      <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border-4 border-indigo-300" id="weak-panel">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 -mx-4 -mt-4 md:-mx-6 md:-mt-6 rounded-t-2xl mb-6 text-white flex items-center justify-between">
          <button
            onClick={() => {
              setIsPlaying(false);
              onRefreshWeakList();
            }}
            className="text-xs bg-indigo-700/50 hover:bg-indigo-700/80 px-2.5 py-1.5 rounded-lg font-bold"
          >
            おわる
          </button>
          <span className="font-bold font-kids">にがてこくふくノック！</span>
          <span className="text-xs font-mono">
            {currentIndex + 1} / {sessionQuestions.length}
          </span>
        </div>

        {/* 進捗 */}
        <div className="w-full bg-slate-100 h-2 rounded-full mb-6">
          <div
            className="bg-indigo-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / sessionQuestions.length) * 100}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {selectedAnswer === null ? (
            <>
              {/* 問題画面 */}
              <div className="md:col-span-7 bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex flex-col items-center justify-center min-h-[180px]">
                <div className="text-4xl md:text-5xl font-extrabold font-mono text-indigo-900 flex items-center gap-3">
                  <span>{currentQ.multiplicand}</span>
                  <span className="text-3xl text-indigo-400">×</span>
                  <span>{currentQ.multiplier}</span>
                  <span className="text-3xl text-indigo-400">=</span>
                  <span className="border-b-4 border-dashed border-indigo-300 px-4 text-gray-400">?</span>
                </div>

                {/* となえかたヒント */}
                <div className="mt-4 bg-white/95 border border-indigo-150 rounded-2xl px-5 py-2.5 flex flex-col items-center shadow-xs max-w-xs w-full">
                  <span className="text-[11px] font-bold text-indigo-500 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> となえながら おぼえていこう！
                  </span>
                  <span className="text-xl md:text-2xl font-bold font-kids text-amber-600 mt-1 tracking-wider">
                    「{getKukuChantQuestion(currentQ.chantDisplay, true)}」
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                    ({getKukuChantQuestion(currentQ.chantDisplay, false)})
                  </span>
                </div>

                {/* 物理ガイド */}
                <div className="mt-6 flex flex-wrap gap-1.5 justify-center max-w-full">
                  {Array.from({ length: currentQ.multiplier }).map((_, gIdx) => (
                    <div key={gIdx} className="bg-white p-1 rounded border border-indigo-100 flex items-center gap-0.5">
                      {Array.from({ length: currentQ.multiplicand }).map((_, iIdx) => (
                        <span key={iIdx} className="text-sm">💩</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 選択肢 */}
              <div className="md:col-span-5 flex flex-col justify-center">
                <h3 className="text-sm font-bold text-indigo-500 mb-3 text-center md:text-left">
                  これなら どうかな？
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {choices.map((num) => (
                    <button
                      key={num}
                      onClick={() => handleAnswer(num)}
                      className="aspect-video sm:aspect-auto sm:py-5 bg-indigo-500 hover:bg-indigo-400 active:scale-95 text-white rounded-2xl text-2xl font-extrabold font-mono border-b-4 border-indigo-700 transition-all shadow-md flex items-center justify-center"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* フィードバック画面 */
            <div className="col-span-12 text-center py-6">
              <div className="mb-4">
                {isCorrect ? (
                  <div className="bg-green-100 rounded-full p-4 inline-block border-4 border-green-400">
                    <Trophy className="w-12 h-12 text-green-500 animate-bounce" />
                  </div>
                ) : (
                  <div className="bg-rose-100 rounded-full p-4 inline-block border-4 border-rose-400">
                    <Heart className="w-12 h-12 text-rose-500" />
                  </div>
                )}
              </div>

              {soundFeedback && (
                <div className="bg-indigo-50 text-indigo-800 px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 mb-4">
                  <Volume2 className="w-4 h-4 text-indigo-500" />
                  {soundFeedback}
                </div>
              )}

              <div className="text-3xl md:text-4xl font-extrabold font-mono text-gray-800 mb-4">
                {currentQ.multiplicand} × {currentQ.multiplier} ={' '}
                <span className="text-indigo-600 underline decoration-wavy decoration-yellow-400 font-bold">
                  {currentQ.answer}
                </span>
              </div>

              <div className="bg-yellow-50 px-5 py-3 rounded-xl border border-yellow-200 inline-block text-sm mb-4">
                <span className="text-xs text-amber-600 block font-bold mb-0.5">となえかた</span>
                <ruby className="text-xl font-bold font-kids text-amber-900 tracking-wide">
                  {currentQ.chant}
                </ruby>
              </div>

              <div>
                <button
                  onClick={nextQuestion}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-kids px-10 py-3 rounded-2xl shadow-lg border-b-4 border-indigo-800 transition-all flex items-center gap-2 mx-auto"
                >
                  {currentIndex + 1 < sessionQuestions.length ? 'つぎへすすむ' : 'セッションをおわる'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border-4 border-indigo-200" id="weak-list-layout">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-dashed border-indigo-100">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-kids text-indigo-600 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-500" />
            うんこにがてクリアひろば 💩
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            クイズで まちがえた もんだいが 自どうてきに たまるよ。せいかいにできると、うんこのようにスッキリきえていくよ！
          </p>
        </div>

        {weakQuestions.length > 0 && (
          <button
            onClick={onClearAllWeak}
            className="text-xs text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-all"
          >
            キレイにリセット
          </button>
        )}
      </div>

      {weakQuestions.length === 0 ? (
        <div className="text-center py-12 px-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-200 mb-4 animate-bounce">
            <Sparkles className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 font-kids">にがてなもんだいは ありません！スッキリ！💩</h3>
          <p className="text-xs text-gray-400 mt-2 max-w-sm">
            すばらしい！クイズなどでまちがえた問題があると、ここへじどうてきに入って 復習こくふく（ふくしゅう）できるようになるよ。
          </p>
        </div>
      ) : (
        <div>
          <div className="bg-indigo-50 hover:bg-indigo-100/80 rounded-2xl p-4 border border-indigo-100 text-center mb-6 transition-all">
            <h3 className="font-kids font-bold text-indigo-800 text-base">
              にがてな問題が <span className="text-xl font-mono text-rose-500">{weakQuestions.length}</span> 問 あります！
            </h3>
            <p className="text-xs text-indigo-600 mt-1">
              これを クイズして 正解（せいかい）すると、にがてをこくふくしてリストから けせるよ！
            </p>
            <button
              onClick={startReviewSession}
              className="mt-4 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-extrabold font-kids px-8 py-3 rounded-xl shadow-md border-b-4 border-indigo-700 transition-all cursor-pointer"
            >
              🎯 にがて克服にちょうせん！
            </button>
          </div>

          <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
            にがて もんだいリスト：
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {weakQuestions.map((wq) => (
              <div
                key={`${wq.multiplicand}x${wq.multiplier}`}
                className="bg-white hover:bg-slate-50 border-2 border-indigo-100 rounded-xl p-3 text-center transition-all relative group"
              >
                <div className="font-mono text-lg font-bold text-gray-700">
                  {wq.multiplicand} × {wq.multiplier}
                </div>
                <div className="text-[10px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full inline-block mt-2 font-bold">
                  まちがえた数: {wq.wrongCount}回
                </div>
                <div className="text-[9px] text-amber-600 block mt-1">
                  （{getKukuItem(wq.multiplicand, wq.multiplier).chant}）
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
