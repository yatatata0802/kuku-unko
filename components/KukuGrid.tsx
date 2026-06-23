import React, { useState } from 'react';
import { getKukuItem } from '../data/kukuData';
import { HelpCircle, Star, Sparkles, Smile } from 'lucide-react';
import { motion } from 'motion/react';
import { playPopSound, speakChant } from '../utils/audio';

export default function KukuGrid() {
  const [selected, setSelected] = useState<{ a: number; b: number } | null>({ a: 2, b: 3 });
  const [visualEmoji, setVisualEmoji] = useState('💩');

  const emojis = ['💩', '💖💩', '🌟💩', '🌈💩', '👑💩', '🔥💩', '🍓💩', '🍩💩', '🌻💩'];

  const handleCellClick = (a: number, b: number) => {
    setSelected({ a, b });
    // Keep or randomly pick a fun emoji
    const randomEmoji = emojis[(a * b) % emojis.length];
    setVisualEmoji(randomEmoji);
    
    playPopSound();
    const item = getKukuItem(a, b);
    if (item && item.chant) {
      speakChant(item.chant);
    }
  };

  const selectedItem = selected ? getKukuItem(selected.a, selected.b) : null;

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border-4 border-yellow-200" id="kuku-grid-section">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-kids text-amber-600 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            うんこ九九（くく）のひょう
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            マスを タップすると、となえかた や <strong>うんこ</strong> の え が えがけるよ！
          </p>
        </div>
        <div className="flex gap-1 bg-amber-50 p-1.5 rounded-2xl border border-amber-200">
          {emojis.slice(0, 5).map((em) => (
            <button
              key={em}
              onClick={() => setVisualEmoji(em)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all text-xl ${
                visualEmoji === em ? 'bg-amber-400 scale-110 shadow-md' : 'hover:bg-amber-100'
              }`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 九九の表 */}
        <div className="lg:col-span-8 overflow-x-auto pb-4">
          <div className="min-w-[420px] bg-amber-50 p-3 rounded-2xl border border-amber-100 shadow-inner">
            {/* ヘッダー行 */}
            <div className="grid grid-cols-10 gap-1 text-center mb-1">
              <div className="aspect-square flex items-center justify-center text-xs font-bold text-amber-700 bg-amber-100 rounded-lg">
                ×
              </div>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                <div
                  key={`h-col-${col}`}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    selected?.b === col
                      ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                      : 'bg-amber-200 text-amber-800'
                  }`}
                >
                  <span className="text-[10px] opacity-75">かける</span>
                  <span className="text-sm">{col}</span>
                </div>
              ))}
            </div>

            {/* 各行 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((row) => (
              <div key={`row-${row}`} className="grid grid-cols-10 gap-1 text-center mb-1">
                {/* 行ラベル */}
                <div
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    selected?.a === row
                      ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                      : 'bg-amber-200 text-amber-800'
                  }`}
                >
                  <span className="text-[10px] opacity-75">かけられる</span>
                  <span className="text-sm">{row}</span>
                </div>

                {/* 各セル */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => {
                  const num = row * col;
                  const isSelected = selected?.a === row && selected?.b === col;
                  const isInRowOrCol = selected?.a === row || selected?.b === col;

                  return (
                    <button
                      key={`cell-${row}-${col}`}
                      id={`cell-${row}-${col}`}
                      onClick={() => handleCellClick(row, col)}
                      className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition-all relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white ring-4 ring-amber-300 scale-105 z-10 shadow-lg'
                          : isInRowOrCol
                          ? 'bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200'
                          : 'bg-white text-gray-700 hover:bg-amber-50 hover:border hover:border-amber-100'
                      }`}
                    >
                      <span>{num}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 bg-sky-50 border border-sky-100 rounded-xl p-3 text-sky-800 text-xs">
            <HelpCircle className="w-5 h-5 text-sky-500 shrink-0" />
            <p>
              九九は、<strong>「かけられる数（左の数）」が「かける数（上の数）のぶんだけある」</strong>という意味だよ。
              たとえば <strong>2 × 3</strong> は、<strong>「2この うんこ💩 が 3つの グループにある」</strong>ということ。たし算にすると 2 + 2 + 2 = 6つ のうんこ になるね！
            </p>
          </div>
        </div>

        {/* 視覚的ビジュアル表示と唱え方 */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {selectedItem ? (
            <motion.div
              key={`${selectedItem.multiplicand}x${selectedItem.multiplier}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-200 shadow-md flex-1 flex flex-col justify-between"
            >
              {/* ふりがな唱え方 */}
              <div className="text-center pb-4 border-b-2 border-dashed border-amber-200">
                <div className="text-2xl font-bold text-gray-400 mb-1 font-mono">
                  {selectedItem.multiplicand} × {selectedItem.multiplier} =
                </div>
                <div className="text-5xl font-extrabold text-amber-600 font-kids my-3">
                  {selectedItem.answer}
                </div>
                <div className="bg-white px-3 py-2 rounded-xl inline-block border border-amber-100 shadow-sm mt-1">
                  <span className="text-xs text-amber-500 block font-bold mb-0.5">唱（とな）えかた</span>
                  <span className="text-lg font-bold font-kids tracking-wider text-amber-800">
                    {selectedItem.chant}
                  </span>
                </div>
              </div>

              {/* ビジュアル表示：かけられる数が いくつかのグループに分かれている様子 */}
              <div className="py-4 flex-1 flex flex-col justify-center">
                <span className="text-[11px] text-gray-500 block text-center font-bold mb-3">
                  イメージ：{selectedItem.multiplicand}こ のうんこ💩 が {selectedItem.multiplier} グループ
                </span>

                <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 justify-center items-center">
                  {Array.from({ length: selectedItem.multiplier }).map((_, idx) => (
                    <div
                      key={`group-${idx}`}
                      className="bg-white p-2 rounded-xl border border-amber-200 flex flex-wrap items-center justify-center gap-1 min-h-[50px] shadow-sm relative"
                    >
                      {/* グループ番号 */}
                      <span className="absolute -top-1.5 -left-1.5 bg-amber-400 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {Array.from({ length: selectedItem.multiplicand }).map((_, itemIdx) => (
                        <span key={`item-${itemIdx}`} className="text-xl animate-float-slow" style={{ animationDelay: `${(idx + itemIdx) * 0.1}s` }}>
                          {visualEmoji}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 足し算換算の表記 */}
              <div className="bg-amber-100/50 p-2.5 rounded-xl text-center text-xs text-amber-900 border border-amber-200/50">
                <span className="font-bold">たしざんにすると：</span>
                <span className="font-mono ml-1">
                  {Array.from({ length: selectedItem.multiplier })
                    .map(() => selectedItem.multiplicand)
                    .join(' + ')}{' '}
                  = {selectedItem.answer}
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 flex flex-col justify-center items-center flex-1">
              <Smile className="w-12 h-12 mb-2 opacity-50" />
              <span>上の 表の マスをクリックしてね！</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
