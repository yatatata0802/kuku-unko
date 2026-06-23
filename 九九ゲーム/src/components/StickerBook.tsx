import React from 'react';
import { Progress } from '../types';
import { stickersList } from '../data/kukuData';
import { Sparkles, Trophy, Award } from 'lucide-react';

interface StickerBookProps {
  progress: Progress;
}

export default function StickerBook({ progress }: StickerBookProps) {
  // Determine earned sticker IDs
  const isStickerEarned = (id: string): boolean => {
    // 1. dan_order_X: Xの段順番クリア
    if (id.startsWith('dan_order_')) {
      const dan = parseInt(id.replace('dan_order_', ''), 10);
      return progress[dan]?.orderMastered || false;
    }

    // 2. dan_shuffle_X: Xの段バラバラクリア
    if (id.startsWith('dan_shuffle_')) {
      const dan = parseInt(id.replace('dan_shuffle_', ''), 10);
      return progress[dan]?.shuffleMastered || false;
    }

    // 3. perfect_dan_X: Xの段パーフェクト（3 or stars >= 3)
    if (id.startsWith('perfect_dan_')) {
      const dan = parseInt(id.replace('perfect_dan_', ''), 10);
      return localStorage.getItem('kuku_perfect_dan_' + dan) === 'true' || progress[dan]?.stars === 3;
    }

    // 4. Play count checks based on play_NUM
    if (id.startsWith('play_')) {
      const limit = parseInt(id.replace('play_', ''), 10);
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= limit;
    }

    // 5. Perfect count checks based on perfect_NUM
    if (id.startsWith('perfect_') && !id.startsWith('perfect_dan_') && !id.startsWith('perfect_challenge')) {
      const limit = parseInt(id.replace('perfect_', ''), 10);
      const val = parseInt(localStorage.getItem('kuku_perfect_count') || '0', 10);
      return val >= limit;
    }

    // 6. Max consecutive perfect score achievements
    if (id.startsWith('consec_perfect_')) {
      const limit = parseInt(id.replace('consec_perfect_', ''), 10);
      const val = parseInt(localStorage.getItem('kuku_max_consecutive_perfect') || '0', 10);
      return val >= limit;
    }

    // 7. Overcome weaknesses
    if (id.startsWith('weak_cleared_')) {
      const limit = parseInt(id.replace('weak_cleared_', ''), 10);
      const val = parseInt(localStorage.getItem('kuku_weak_cleared_count') || '0', 10);
      return val >= limit;
    }

    // General play count check legacy fallback
    if (id === 'play_5') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 5;
    }
    if (id === 'play_15') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 15;
    }
    if (id === 'perfect_3') {
      const val = parseInt(localStorage.getItem('kuku_perfect_count') || '0', 10);
      return val >= 3;
    }
    if (id === 'perfect_10') {
      const val = parseInt(localStorage.getItem('kuku_perfect_count') || '0', 10);
      return val >= 10;
    }
    if (id === 'weak_cleared') {
      const val = parseInt(localStorage.getItem('kuku_weak_cleared_count') || '0', 10);
      return val >= 3;
    }

    // Best Time helper
    const getMinBestTime = (): number => {
      try {
        const stored = localStorage.getItem('kuku_best_times');
        if (stored) {
          const bestTimes = JSON.parse(stored);
          let minTime = 999;
          for (const key in bestTimes) {
            const typesObj = bestTimes[key];
            if (typeof typesObj === 'object') {
              for (const typeKey in typesObj) {
                const t = typesObj[typeKey];
                if (typeof t === 'number' && t > 0 && t < minTime) {
                  minTime = t;
                }
              }
            } else if (typeof typesObj === 'number' && typesObj > 0 && typesObj < minTime) {
              minTime = typesObj;
            }
          }
          return minTime;
        }
      } catch (e) {
        console.error(e);
      }
      return 999;
    };

    const minTime = getMinBestTime();

    // Challenge Best Time helper
    const getChallengeBestTime = (): number => {
      try {
        const stored = localStorage.getItem('kuku_best_times');
        if (stored) {
          const bestTimes = JSON.parse(stored);
          if (typeof bestTimes['challenge'] === 'number') {
            return bestTimes['challenge'];
          }
        }
      } catch (e) {
        console.error(e);
      }
      return 999;
    };

    const challengeMinTime = getChallengeBestTime();

    // job checks
    if (id === 'job_doctor') {
      const val = parseInt(localStorage.getItem('kuku_weak_cleared_count') || '0', 10);
      return val >= 1;
    }
    if (id === 'job_firefighter') {
      const val = parseInt(localStorage.getItem('kuku_weak_cleared_count') || '0', 10);
      return val >= 3;
    }
    if (id === 'job_police') {
      const val = parseInt(localStorage.getItem('kuku_weak_cleared_count') || '0', 10);
      return val >= 8;
    }
    if (id === 'job_astronaut') {
      return minTime < 10;
    }
    if (id === 'job_ninja') {
      return minTime < 15;
    }
    if (id === 'job_wizard') {
      return [1, 3, 5, 7, 9].every((d) => progress[d]?.shuffleMastered === true);
    }
    if (id === 'job_dancer') {
      return [2, 4, 6, 8].every((d) => progress[d]?.shuffleMastered === true);
    }
    if (id === 'job_guitarist') {
      const val = parseInt(localStorage.getItem('kuku_challenge_completed_count') || '0', 10);
      return val >= 5;
    }
    if (id === 'job_dreamer') {
      return progress[5]?.shuffleMastered === true;
    }
    if (id === 'job_detective') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 25;
    }
    if (id === 'job_pilot') {
      const val = parseInt(localStorage.getItem('kuku_challenge_completed_count') || '0', 10);
      return val >= 3;
    }
    if (id === 'job_chef') {
      return true; // Autounlocks
    }
    if (id === 'job_farmer') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 12;
    }
    if (id === 'job_artist') {
      return [2, 4, 6, 8].some((d) => progress[d]?.orderMastered === true || progress[d]?.shuffleMastered === true);
    }
    if (id === 'job_programmer') {
      const val = parseInt(localStorage.getItem('kuku_weak_cleared_count') || '0', 10);
      return val >= 10;
    }

    // food checks
    if (id === 'food_curry') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 3;
    }
    if (id === 'food_ice') {
      return progress[3]?.shuffleMastered === true && progress[6]?.shuffleMastered === true;
    }
    if (id === 'food_cake') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 15;
    }
    if (id === 'food_melon') {
      return progress[4]?.orderMastered === true && progress[5]?.orderMastered === true;
    }
    if (id === 'food_ramen') {
      return minTime <= 20;
    }
    if (id === 'food_sushi') {
      const count = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => progress[d]?.shuffleMastered).length;
      return count >= 5;
    }
    if (id === 'food_potato') {
      const count = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => progress[d]?.orderMastered).length;
      return count >= 5;
    }
    if (id === 'food_tapioca') {
      const bestScore = parseInt(localStorage.getItem('kuku_challenge_best_score') || '0', 10);
      return bestScore >= 8;
    }
    if (id === 'food_parfait') {
      const val = parseInt(localStorage.getItem('kuku_perfect_count') || '0', 10);
      return val >= 5;
    }
    if (id === 'food_choco') {
      return (
        (progress[2]?.orderMastered || progress[2]?.shuffleMastered) &&
        (progress[4]?.orderMastered || progress[4]?.shuffleMastered) &&
        (progress[8]?.orderMastered || progress[8]?.shuffleMastered)
      );
    }
    if (id === 'food_takoyaki') {
      return localStorage.getItem('kuku_perfect_dan_6') === 'true' || progress[6]?.stars === 3;
    }
    if (id === 'food_burger') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 35;
    }
    if (id === 'food_donut') {
      return localStorage.getItem('kuku_perfect_dan_3') === 'true' || progress[3]?.stars === 3;
    }
    if (id === 'food_pizza') {
      return localStorage.getItem('kuku_perfect_dan_4') === 'true' || progress[4]?.stars === 3;
    }
    if (id === 'food_pudding') {
      return localStorage.getItem('kuku_perfect_dan_5') === 'true' || progress[5]?.stars === 3;
    }

    // animal checks
    if (id === 'animal_cat') {
      return progress[3]?.orderMastered === true || progress[3]?.shuffleMastered === true;
    }
    if (id === 'animal_dog') {
      return progress[4]?.orderMastered === true || progress[4]?.shuffleMastered === true;
    }
    if (id === 'animal_lion') {
      return localStorage.getItem('kuku_perfect_dan_8') === 'true' || progress[8]?.stars === 3;
    }
    if (id === 'animal_panda') {
      return progress[7]?.orderMastered === true || progress[7]?.shuffleMastered === true;
    }
    if (id === 'animal_penguin') {
      return localStorage.getItem('kuku_completed_morning') === 'true';
    }
    if (id === 'animal_frog') {
      return progress[6]?.orderMastered === true || progress[6]?.shuffleMastered === true;
    }
    if (id === 'animal_koala') {
      return progress[5]?.orderMastered === true || progress[5]?.shuffleMastered === true;
    }
    if (id === 'animal_dragon') {
      return progress[9]?.shuffleMastered === true;
    }
    if (id === 'animal_rabbit') {
      return progress[2]?.orderMastered === true || progress[2]?.shuffleMastered === true;
    }
    if (id === 'animal_bear') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 10;
    }
    if (id === 'animal_monkey') {
      return progress[1]?.orderMastered === true || progress[1]?.shuffleMastered === true;
    }
    if (id === 'animal_tiger') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 18;
    }
    if (id === 'animal_pig') {
      return localStorage.getItem('kuku_perfect_dan_1') === 'true' || progress[1]?.stars === 3;
    }
    if (id === 'animal_hamster') {
      return localStorage.getItem('kuku_perfect_dan_2') === 'true' || progress[2]?.stars === 3;
    }
    if (id === 'animal_shark') {
      return minTime <= 15;
    }

    // sports checks
    if (id === 'sports_soccer') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 10;
    }
    if (id === 'sports_baseball') {
      return progress[8]?.shuffleMastered === true;
    }
    if (id === 'sports_swimming') {
      return progress[2]?.shuffleMastered === true && progress[5]?.shuffleMastered === true;
    }
    if (id === 'sports_tennis') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 30;
    }
    if (id === 'sports_boxing') {
      return challengeMinTime <= 25;
    }
    if (id === 'sports_skate') {
      return minTime <= 12;
    }
    if (id === 'sports_basket') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 8;
    }
    if (id === 'sports_golf') {
      const val = parseInt(localStorage.getItem('kuku_weak_cleared_count') || '0', 10);
      return val >= 5;
    }
    if (id === 'sports_ski') {
      return localStorage.getItem('kuku_completed_morning') === 'true';
    }
    if (id === 'sports_marathon') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 40;
    }
    if (id === 'sports_judo') {
      return parseInt(localStorage.getItem('kuku_challenge_completed_count') || '0', 10) >= 1;
    }
    if (id === 'sports_sumo') {
      return localStorage.getItem('kuku_perfect_dan_9') === 'true' || progress[9]?.stars === 3;
    }
    if (id === 'sports_bowling') {
      const val = parseInt(localStorage.getItem('kuku_perfect_count') || '0', 10);
      return val >= 2;
    }
    if (id === 'sports_curling') {
      return progress[3]?.shuffleMastered === true;
    }
    if (id === 'sports_cycling') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 20;
    }

    // space & nature checks
    if (id === 'space_alien') {
      return localStorage.getItem('kuku_completed_evening') === 'true';
    }
    if (id === 'space_ufo') {
      return challengeMinTime <= 15;
    }
    if (id === 'nature_volcano') {
      const val = parseInt(localStorage.getItem('kuku_perfect_count') || '0', 10);
      return val >= 10;
    }
    if (id === 'nature_snowflake') {
      return localStorage.getItem('kuku_completed_morning') === 'true';
    }
    if (id === 'nature_thunder') {
      return minTime <= 14;
    }
    if (id === 'nature_meteor') {
      return challengeMinTime <= 35;
    }
    if (id === 'nature_wormhole') {
      return challengeMinTime <= 30;
    }
    if (id === 'nature_sun') {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].every((d) => progress[d]?.orderMastered === true);
    }
    if (id === 'nature_moon') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 50;
    }
    if (id === 'nature_earth') {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].every((d) => progress[d]?.shuffleMastered === true);
    }
    if (id === 'nature_rainbow') {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].every((d) => progress[d]?.stars === 3);
    }
    if (id === 'nature_galaxy') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 100;
    }
    if (id === 'nature_aurora') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 75;
    }
    if (id === 'nature_cloud') {
      return progress[2]?.orderMastered === true;
    }
    if (id === 'nature_fire') {
      return progress[3]?.orderMastered === true;
    }

    // emoji checks
    if (id === 'emoji_smile') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 2;
    }
    if (id === 'emoji_angry') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 5;
    }
    if (id === 'emoji_cry') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 1;
    }
    if (id === 'emoji_shock') {
      const val = parseInt(localStorage.getItem('kuku_challenge_completed_count') || '0', 10);
      return val >= 1;
    }
    if (id === 'emoji_sleep') {
      return localStorage.getItem('kuku_completed_night') === 'true' || localStorage.getItem('kuku_completed_evening') === 'true';
    }
    if (id === 'emoji_zombie') {
      const val = parseInt(localStorage.getItem('kuku_weak_cleared_count') || '0', 10);
      return val >= 1;
    }
    if (id === 'emoji_fart') {
      return minTime <= 16;
    }
    if (id === 'job_glasses') {
      const bestScore = parseInt(localStorage.getItem('kuku_challenge_best_score') || '0', 10);
      return bestScore >= 9;
    }
    if (id === 'emoji_sparkle') {
      const val = parseInt(localStorage.getItem('kuku_perfect_count') || '0', 10);
      return val >= 3;
    }
    if (id === 'emoji_wink') {
      const val = parseInt(localStorage.getItem('kuku_perfect_count') || '0', 10);
      return val >= 4;
    }
    if (id === 'emoji_cool') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 15;
    }
    if (id === 'emoji_gasp') {
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      return val >= 3;
    }
    if (id === 'emoji_heart_eyes') {
      const val = parseInt(localStorage.getItem('kuku_perfect_count') || '0', 10);
      return val >= 8;
    }
    if (id === 'emoji_party') {
      const val = parseInt(localStorage.getItem('kuku_perfect_count') || '0', 10);
      return val >= 12;
    }
    if (id === 'emoji_bored') {
      return localStorage.getItem('kuku_completed_night') === 'true' || localStorage.getItem('kuku_completed_evening') === 'true';
    }

    // general custom legacy achievements
    if (id === 'order_all') {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].every((d) => progress[d]?.orderMastered === true);
    }
    if (id === 'shuffle_all') {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].every((d) => progress[d]?.shuffleMastered === true);
    }
    if (id === 'perfect_challenge') {
      return localStorage.getItem('kuku_perfect_challenge') === 'true';
    }
    if (id === 'weak_all_zero') {
      const weakSaved = localStorage.getItem('kuku_weak_v2');
      const curWeak = weakSaved ? JSON.parse(weakSaved) : [];
      const val = parseInt(localStorage.getItem('kuku_play_count') || '0', 10);
      const valCleared = parseInt(localStorage.getItem('kuku_weak_cleared_count') || '0', 10);
      return val >= 3 && curWeak.length === 0 && valCleared >= 1;
    }

    return false;
  };

  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const earnedCount = stickersList.filter((s) => isStickerEarned(s.id)).length;

  const getStickerCategory = (id: string): string => {
    if (id.startsWith('dan_') || id.startsWith('perfect_dan_')) return 'dan';
    if (id.startsWith('job_')) return 'job';
    if (id.startsWith('food_')) return 'food';
    if (id.startsWith('animal_')) return 'animal';
    if (id.startsWith('sports_')) return 'sports';
    if (id.startsWith('space_') || id.startsWith('nature_')) return 'space';
    if (id.startsWith('emoji_')) return 'emoji';
    return 'challenge';
  };

  const categories = [
    { key: 'all', name: 'すべて', icon: '🌈' },
    { key: 'dan', name: '1~9だん', icon: '🏫' },
    { key: 'job', name: 'お仕事', icon: '👷' },
    { key: 'food', name: '食べ物', icon: '😋' },
    { key: 'animal', name: 'どうぶつ', icon: '🦁' },
    { key: 'sports', name: 'スポーツ', icon: '⚽' },
    { key: 'space', name: '宇宙・自然', icon: '🌍' },
    { key: 'emoji', name: 'きもち', icon: '😊' },
    { key: 'challenge', name: 'やりこみ', icon: '👑' },
  ];

  const filteredStickers = stickersList.filter((st) => {
    if (activeCategory === 'all') return true;
    return getStickerCategory(st.id) === activeCategory;
  });

  // Calculate earned counts per category
  const getCategoryStats = (catKey: string): { earned: number; total: number } => {
    const list = stickersList.filter((st) => catKey === 'all' || getStickerCategory(st.id) === catKey);
    const earned = list.filter((st) => isStickerEarned(st.id)).length;
    return { earned, total: list.length };
  };

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border-4 border-pink-200" id="sticker-container">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-dashed border-pink-100">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-kids text-pink-600 flex items-center gap-2">
            <Award className="w-7 h-7 text-pink-500 animate-pulse" />
            がんばりうんこシール帳（ちょう）
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            九九の れんしゅうを クリアすると、おもしろい <strong>うんこシール💩</strong> が はられるよ。ぜんぶ あつめられるかな？
          </p>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-2xl px-4 py-2 flex items-center gap-2 shrink-0">
          <Trophy className="w-5 h-5 text-yellow-400 fill-yellow-450" />
          <span className="text-sm font-bold text-pink-800">
            あつめたシール: <strong className="text-xl text-pink-600 font-mono font-extrabold">{earnedCount}</strong> / {stickersList.length} こ
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6" id="sticker-tabs-row">
        {categories.map((cat) => {
          const stats = getCategoryStats(cat.key);
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 border transition-all ${
                isActive
                  ? 'bg-pink-500 text-white border-pink-500 shadow-md scale-105'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                isActive ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stats.earned}/{stats.total}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5" id="sticker-grids">
        {filteredStickers.map((st) => {
          const earned = isStickerEarned(st.id);

          return (
            <div
              key={st.id}
              className={`relative rounded-2xl p-4 border flex flex-col items-center text-center transition-all ${
                earned
                  ? `bg-gradient-to-b ${st.color} border-white shadow-md scale-100 hover:scale-105`
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              {/* シールのきらきら装飾 */}
              {earned && (
                <div className="absolute top-2 right-2 animate-ping text-[10px]">✨</div>
              )}

              {/* シール本体 */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner ${
                  earned ? 'bg-white h-14' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {earned ? st.emoji : '🔒'}
              </div>

              <h3 className={`text-xs font-extrabold ${earned ? 'text-amber-950 font-kids' : 'text-gray-500'}`}>
                {st.name}
              </h3>
              <p className="text-[9px] text-gray-400 mt-1 lines-clamp-2 leading-snug">
                {st.cond}
              </p>
            </div>
          );
        })}
      </div>

      {filteredStickers.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          まだこのカテゴリーのシールは ありません。
        </div>
      )}

      {earnedCount === stickersList.length && (
        <div className="mt-8 bg-gradient-to-r from-yellow-100 to-amber-100 p-6 rounded-2xl border-2 border-yellow-300 text-center animate-bounce">
          <h3 className="text-xl font-bold font-kids text-amber-800">🎉 かんぺき！うんこ九九スーパー大おう！ 🎉</h3>
          <p className="text-xs text-amber-700 mt-1">
            すべての <strong>うんこシール💩</strong> を、あつめおわったよ！これで２学期の 算数は ばっちり大とくいだね！
          </p>
        </div>
      )}
    </div>
  );
}
