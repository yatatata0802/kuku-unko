/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Progress, WeakQuestion, PracticeType } from './types';
import KukuGrid from './components/KukuGrid';
import PracticeMode from './components/PracticeMode';
import ChallengeMode from './components/ChallengeMode';
import StickerBook from './components/StickerBook';
import WeakPoints from './components/WeakPoints';
import { Sparkles, Trophy, Award, BookOpen, Clock, Heart, Star, LayoutGrid, RotateCcw, Shield, Volume2, VolumeX, MessageCirclePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initializeMuteState, toggleMute, toggleSpeech, isGameMuted, isSpeechEnabled, playPopSound, speakChant } from './utils/audio';

const INITIAL_PROGRESS: Progress = {
  1: { unlocked: true, orderMastered: false, shuffleMastered: false, stars: 0, highScore: 0 },
  2: { unlocked: true, orderMastered: false, shuffleMastered: false, stars: 0, highScore: 0 },
  3: { unlocked: true, orderMastered: false, shuffleMastered: false, stars: 0, highScore: 0 },
  4: { unlocked: true, orderMastered: false, shuffleMastered: false, stars: 0, highScore: 0 },
  5: { unlocked: true, orderMastered: false, shuffleMastered: false, stars: 0, highScore: 0 },
  6: { unlocked: true, orderMastered: false, shuffleMastered: false, stars: 0, highScore: 0 },
  7: { unlocked: true, orderMastered: false, shuffleMastered: false, stars: 0, highScore: 0 },
  8: { unlocked: true, orderMastered: false, shuffleMastered: false, stars: 0, highScore: 0 },
  9: { unlocked: true, orderMastered: false, shuffleMastered: false, stars: 0, highScore: 0 },
};

export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'practice' | 'challenge' | 'stickers' | 'weakpoints' | 'grid'>('dashboard');
  const [selectedDan, setSelectedDan] = useState<number>(2);
  const [practiceType, setPracticeType] = useState<PracticeType>('order');
  const [progress, setProgress] = useState<Progress>(INITIAL_PROGRESS);
  const [weakQuestions, setWeakQuestions] = useState<WeakQuestion[]>([]);
  const [isAllUnlocked, setIsAllUnlocked] = useState<boolean>(true); // Let kids jump to any row since custom curriculums exist
  const [muted, setMuted] = useState<boolean>(false);
  const [speechOn, setSpeechOn] = useState<boolean>(true);

  // Load from LocalStorage
  useEffect(() => {
    initializeMuteState();
    setMuted(isGameMuted());
    setSpeechOn(isSpeechEnabled());

    const savedProgress = localStorage.getItem('kuku_progress_v2');
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Error loading saved progress', e);
      }
    }

    const savedWeak = localStorage.getItem('kuku_weak_v2');
    if (savedWeak) {
      try {
        setWeakQuestions(JSON.parse(savedWeak));
      } catch (e) {
        console.error('Error loading weak points', e);
      }
    }
  }, []);

  const updateProgress = (newProgress: Progress) => {
    setProgress(newProgress);
    localStorage.setItem('kuku_progress_v2', JSON.stringify(newProgress));
  };

  const addWeakQuestion = (multiplicand: number, multiplier: number) => {
    const updated = [...weakQuestions];
    const existingIdx = updated.findIndex(
      (wq) => wq.multiplicand === multiplicand && wq.multiplier === multiplier
    );

    if (existingIdx !== -1) {
      updated[existingIdx].wrongCount += 1;
    } else {
      updated.push({ multiplicand, multiplier, wrongCount: 1 });
    }

    setWeakQuestions(updated);
    localStorage.setItem('kuku_weak_v2', JSON.stringify(updated));
  };

  const removeWeakQuestion = (multiplicand: number, multiplier: number) => {
    let updated = [...weakQuestions];
    const idx = updated.findIndex(
      (wq) => wq.multiplicand === multiplicand && wq.multiplier === multiplier
    );

    if (idx !== -1) {
      if (updated[idx].wrongCount > 1) {
        // Decrease weight
        updated[idx].wrongCount -= 1;
      } else {
        // Remove completely
        updated = updated.filter(
          (wq) => !(wq.multiplicand === multiplicand && wq.multiplier === multiplier)
        );
      }
    }

    setWeakQuestions(updated);
    localStorage.setItem('kuku_weak_v2', JSON.stringify(updated));
  };

  const refreshWeakPointsList = () => {
    const savedWeak = localStorage.getItem('kuku_weak_v2');
    if (savedWeak) {
      setWeakQuestions(JSON.parse(savedWeak));
    }
  };

  const clearAllWeak = () => {
    if (window.confirm('にがてな問題のデータを、すべてリセットしていいですか？')) {
      setWeakQuestions([]);
      localStorage.removeItem('kuku_weak_v2');
    }
  };

  const resetAllProgress = () => {
    if (window.confirm('すべてのやる気シールや成績、にがてリストを完全に消去します。よろしいですか？')) {
      setProgress(INITIAL_PROGRESS);
      setWeakQuestions([]);
      localStorage.removeItem('kuku_progress_v2');
      localStorage.removeItem('kuku_weak_v2');
      localStorage.removeItem('kuku_perfect_challenge');
      localStorage.removeItem('kuku_play_count');
      localStorage.removeItem('kuku_perfect_count');
      localStorage.removeItem('kuku_weak_cleared_count');
      localStorage.removeItem('kuku_completed_morning');
      localStorage.removeItem('kuku_completed_evening');
      localStorage.removeItem('kuku_completed_night');
      localStorage.removeItem('kuku_lucky_seven_perfect');
      localStorage.removeItem('kuku_dan9_perfect');
      localStorage.removeItem('kuku_best_times');
      localStorage.removeItem('kuku_consecutive_perfect');
      localStorage.removeItem('kuku_max_consecutive_perfect');
      localStorage.removeItem('kuku_challenge_best_score');
      localStorage.removeItem('kuku_challenge_completed_count');
      for (let d = 1; d <= 9; d++) {
        localStorage.removeItem('kuku_perfect_dan_' + d);
      }
      alert('すべてのデータをリセットしました！新しいきもちでがんばろう！');
    }
  };

  // Inline model choices popup
  const [showDanModal, setShowDanModal] = useState<number | null>(null);

  const handleToggleMute = () => {
    const newState = toggleMute();
    setMuted(newState);
    if (!newState) {
      playPopSound();
    }
  };

  const handleToggleSpeech = () => {
    const newState = toggleSpeech();
    setSpeechOn(newState);
    playPopSound();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-3 md:p-6 select-none" id="main-app-container">
      {/* 最高のヘッダー */}
      <header className="w-full max-w-4xl text-center mb-6 mt-2 relative">
        <div className="absolute top-0 left-4 animate-float-slow text-3xl hidden md:block">💩</div>
        <div className="absolute top-2 right-4 animate-float-slow text-3xl hidden md:block" style={{ animationDelay: '2s' }}>💩✨</div>
        
        <div className="absolute right-0 top-0 flex items-center gap-2 mb-4 md:mb-0">
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-full transition-all border ${
              muted
                ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                : 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
            }`}
            title={muted ? '音波を出す' : '音を消す'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleToggleSpeech}
            className={`p-2 rounded-full transition-all border text-xs font-bold font-kids ${
              speechOn
                ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                : 'bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-200'
            }`}
            title={speechOn ? '読み上げオン' : '読み上げオフ'}
          >
            🗣️ {speechOn ? 'オン' : 'オフ'}
          </button>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold font-kids text-amber-500 tracking-wider flex items-center justify-center gap-2 drop-shadow-sm">
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 fill-yellow-400 animate-spin-slow" />
          うんこ九九（くく）ドリル
        </h1>
        <p className="text-xs md:text-sm font-bold text-gray-500 mt-2 font-kids">
          小学２年生むけ 💩 ２がっきが はじまるまえに ぷにぷに おぼえちゃおう！
        </p>
      </header>

      {/* メインスペース */}
      <main className="w-full max-w-4xl flex-1 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* クイック統計 / がんばり状況 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-3xl shadow-md border-2 border-amber-100">
                <div
                  onClick={() => { playPopSound(); setActiveView('grid'); }}
                  className="bg-amber-50 border border-amber-100 hover:border-amber-300 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                >
                  <LayoutGrid className="w-6 h-6 text-amber-500 mb-1" />
                  <span className="text-[11px] font-bold text-gray-500">うんコのきほん</span>
                  <span className="text-xs font-bold text-amber-800 font-kids mt-0.5">九九のひょう 💩 ➔</span>
                </div>

                <div
                  onClick={() => { playPopSound(); setActiveView('stickers'); }}
                  className="bg-pink-50 border border-pink-100 hover:border-pink-300 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                >
                  <Award className="w-6 h-6 text-pink-500 mb-1" />
                  <span className="text-[11px] font-bold text-gray-500 font-sans">がんばりうんこシール</span>
                  <span className="text-xs font-bold text-pink-800 font-kids mt-0.5">うんこシール帳 ➔</span>
                </div>

                <div
                  onClick={() => { playPopSound(); setActiveView('weakpoints'); }}
                  className="bg-indigo-50 border border-indigo-100 hover:border-indigo-300 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                >
                  <BookOpen className="w-6 h-6 text-indigo-500 mb-1" />
                  <span className="text-[11px] font-bold text-gray-500">にがてをクリアする</span>
                  <span className="text-xs font-bold text-indigo-800 font-kids mt-0.5">
                    にがてこくふく
                    {weakQuestions.length > 0 && (
                      <span className="ml-1 bg-rose-500 text-white font-mono text-[10px] w-4 h-4 rounded-full inline-flex items-center justify-center font-bold animate-bounce">
                        {weakQuestions.length}
                      </span>
                    )}
                    {' '}➔
                  </span>
                </div>

                <div
                  onClick={() => { playPopSound(); setActiveView('challenge'); }}
                  className="bg-yellow-50 border border-yellow-105 hover:border-yellow-300 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                >
                  <Trophy className="w-6 h-6 text-yellow-500 mb-1" />
                  <span className="text-[11px] font-bold text-gray-500">実力をためす</span>
                  <span className="text-xs font-bold text-yellow-800 font-kids mt-0.5">うんこちからだめし ➔</span>
                </div>
              </div>

              {/* 段セレクターのメインボード */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-amber-200">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-2">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold font-kids text-amber-800">
                      どの「だん」を れんしゅうする？
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      クリアすると「じゅんばん」「バラバラ」に <strong>うんこシール</strong> がつくよ！💩
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAllUnlocked}
                        onChange={(e) => setIsAllUnlocked(e.target.checked)}
                        className="rounded accent-amber-500"
                      />
                      <span>ぜんぶのだんを遊べるようにする</span>
                    </label>
                  </div>
                </div>

                {/* 1から9までの可愛いボックス */}
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dan) => {
                    const rowProg = progress[dan] || {
                      unlocked: dan === 1,
                      orderMastered: false,
                      shuffleMastered: false,
                      stars: 0
                    };

                    const unlocked = isAllUnlocked || dan === 1 || rowProg.unlocked;

                    // Star assessment
                    const countStars = (rowProg.orderMastered ? 1 : 0) + (rowProg.shuffleMastered ? 2 : 0);

                    return (
                      <div
                        key={dan}
                        id={`dan-card-${dan}`}
                        className={`relative rounded-3xl p-4 border-2 transition-all overflow-hidden flex flex-col justify-between group min-h-[120px] ${
                          unlocked
                            ? 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200 hover:border-amber-400 hover:shadow-md cursor-pointer'
                            : 'bg-gray-100 border-gray-200 opacity-60'
                        }`}
                        onClick={() => {
                          if (unlocked) {
                            playPopSound();
                            setShowDanModal(dan);
                            speakChant(`${dan}のだん！`);
                          } else {
                            playPopSound();
                            alert(`まえの段をクリアすると、${dan}のだんがひらくよ！\n（右上のチェックを入れると、ぜんぶの段をすぐ遊べるよ！）`);
                          }
                        }}
                      >
                        {/* 左上デザイン：〇のだん */}
                        <div className="flex justify-between items-start">
                          <span className="font-kids text-2xl font-extrabold text-amber-600">
                            {dan}
                            <span className="text-xs font-bold text-amber-800 ml-0.5">のだん</span>
                          </span>
                          
                          {/* ロックマーク or 星 */}
                          {!unlocked ? (
                            <span className="text-lg">🔒</span>
                          ) : (
                            <div className="flex gap-0.5">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < countStars
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* クリア情報・スタンプ */}
                        <div className="mt-4 flex flex-wrap gap-1">
                          {rowProg.orderMastered && (
                            <span className="text-[9px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded-md font-bold">
                              ✓ じゅんばん
                            </span>
                          )}
                          {rowProg.shuffleMastered && (
                            <span className="text-[9px] bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded-md font-bold">
                              ✓ バラバラ
                            </span>
                          )}
                          {!rowProg.orderMastered && !rowProg.shuffleMastered && unlocked && (
                            <span className="text-[9px] text-amber-700/60 font-bold italic">
                              れんしゅう中
                            </span>
                          )}
                        </div>

                        {/* ホバーキラキラエフェクト */}
                        {unlocked && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all font-bold text-xs text-amber-400">
                            GO➔
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* クイックガイド説明カード */}
              <div className="bg-sky-50 border-2 border-sky-200 p-5 rounded-3xl flex flex-col sm:flex-row items-center gap-4 text-sky-800">
                <div className="w-12 h-12 rounded-2xl bg-white border border-sky-200 flex items-center justify-center shrink-0">
                  <span className="text-2xl">💩</span>
                </div>
                <div>
                  <h3 className="font-kids font-bold text-sm md:text-base">💩 うんこ先生の かしこい勉強法（べんきょうほう）：</h3>
                  <p className="text-xs mt-1 leading-relaxed text-sky-700">
                    まずは<strong>「九九のひょう」</strong>で、どうしておなじ数がふえていくのか、<strong>うんこの数💩</strong>でみてみよう。<br />
                    つぎに、すきなだんの<strong>「じゅんばん」</strong>れんしゅう。ひらがなを声に出して何度もとなえ、なれたら<strong>「バラバラ」</strong>にちょうせん！まちがえたもんだいは、じどうてきに「にがてクリア」にたまるから、そこから何度も復習するとかんたんに覚えられるよっ！
                  </p>
                </div>
              </div>

              {/* 完全データ初期化（隠し親向けリンク） */}
              <div className="text-center pt-4">
                <button
                  onClick={resetAllProgress}
                  className="text-[10px] text-gray-400 hover:text-rose-500 flex items-center gap-1 mx-auto transition-all bg-slate-100 px-2 py-1 rounded"
                >
                  <RotateCcw className="w-3 h-3" /> さいしょからやりなおす（データ初期化）
                </button>
              </div>
            </motion.div>
          )}

          {activeView === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <button
                onClick={() => { playPopSound(); setActiveView('dashboard'); }}
                className="bg-white border border-gray-200 hover:bg-slate-50 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs md:text-sm flex items-center gap-1.5"
              >
                ← メニューにもどる
              </button>
              <KukuGrid />
            </motion.div>
          )}

          {activeView === 'stickers' && (
            <motion.div
              key="stickers"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <button
                onClick={() => { playPopSound(); setActiveView('dashboard'); }}
                className="bg-white border border-gray-200 hover:bg-slate-50 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs md:text-sm flex items-center gap-1.5"
              >
                ← メニューにもどる
              </button>
              <StickerBook progress={progress} />
            </motion.div>
          )}

          {activeView === 'weakpoints' && (
            <motion.div
              key="weakpoints"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <button
                onClick={() => { playPopSound(); setActiveView('dashboard'); }}
                className="bg-white border border-gray-200 hover:bg-slate-50 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs md:text-sm flex items-center gap-1.5"
                id="btn-weak-back"
              >
                ← メニューにもどる
              </button>
              <WeakPoints
                weakQuestions={weakQuestions}
                onRemoveWeakQuestion={removeWeakQuestion}
                onClearAllWeak={clearAllWeak}
                onRefreshWeakList={refreshWeakPointsList}
              />
            </motion.div>
          )}

          {activeView === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PracticeMode
                progress={progress}
                onUpdateProgress={updateProgress}
                onAddWeakQuestion={addWeakQuestion}
                onBackToDashboard={() => setActiveView('dashboard')}
                selectedDan={selectedDan}
                initialType={practiceType}
              />
            </motion.div>
          )}

          {activeView === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ChallengeMode
                progress={progress}
                onUpdateProgress={updateProgress}
                onAddWeakQuestion={addWeakQuestion}
                onBackToDashboard={() => setActiveView('dashboard')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* だん を タップしたときの選択肢ポップアップ (Modal) */}
      <AnimatePresence>
        {showDanModal !== null && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-yellow-250 shadow-2xl relative"
            >
              {/* バツ印で閉じる */}
              <button
                onClick={() => setShowDanModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>

              <h3 className="text-2xl font-black font-kids text-amber-500 text-center mb-1">
                {showDanModal}のだん
              </h3>
              <p className="text-xs text-gray-400 text-center mb-6">
                どうやって れんしゅうする？
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setSelectedDan(showDanModal);
                    setPracticeType('order');
                    setActiveView('practice');
                    setShowDanModal(null);
                  }}
                  className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-extrabold font-kids p-4 rounded-2xl shadow-md border-b-4 border-sky-700 transition-all text-left flex items-center justify-between"
                  id="order-practice-btn"
                >
                  <div>
                    <span className="block text-[10px] text-sky-100 font-sans">じゅんばんに もんだいが出るよ</span>
                    <span>1. じゅんばん （順番）</span>
                  </div>
                  <span className="text-xl">➔</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedDan(showDanModal);
                    setPracticeType('shuffle');
                    setActiveView('practice');
                    setShowDanModal(null);
                  }}
                  className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-extrabold font-kids p-4 rounded-2xl shadow-md border-b-4 border-pink-700 transition-all text-left flex items-center justify-between"
                  id="shuffle-practice-btn"
                >
                  <div>
                    <span className="block text-[10px] text-pink-100 font-sans">問題が バラバラに 出るよ</span>
                    <span>2. バラバラ （ランダム）</span>
                  </div>
                  <span className="text-xl">➔</span>
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowDanModal(null)}
                  className="text-xs text-gray-500 hover:underline"
                >
                  キャンセル
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* フッター */}
      <footer className="w-full max-w-4xl text-center py-6 mt-8 border-t border-gray-205 text-[11px] text-gray-450">
        <p>© 2026 九九のきょうしつ. Noto Sans JP & Kiwi Maru fonts.</p>
      </footer>
    </div>
  );
}
