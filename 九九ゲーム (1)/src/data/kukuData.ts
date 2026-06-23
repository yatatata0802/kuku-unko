import { KukuItem } from '../types';

export const kukuChantData: { [key: string]: { chant: string; display: string } } = {
  // 1の段
  '1x1': { chant: 'いんいちがいち', display: 'いん・いち・が・いち' },
  '1x2': { chant: 'いんにがに', display: 'いん・に・が・に' },
  '1x3': { chant: 'いんさんがさん', display: 'いん・さん・が・さん' },
  '1x4': { chant: 'いんしがし', display: 'いん・し・が・し' },
  '1x5': { chant: 'いんごがご', display: 'いん・ご・が・ご' },
  '1x6': { chant: 'いんろくがろく', display: 'いん・ろく・が・ろく' },
  '1x7': { chant: 'いんしちがしち', display: 'いん・しち・が・しち' },
  '1x8': { chant: 'いんはちがはち', display: 'いん・はち・が・はち' },
  '1x9': { chant: 'いんくがく', display: 'いん・く・が・く' },

  // 2の段
  '2x1': { chant: 'にいちがに', display: 'に・いち・が・に' },
  '2x2': { chant: 'ににんがし', display: 'に・にん・が・し' },
  '2x3': { chant: 'にさんがろく', display: 'に・さん・が・ろく' },
  '2x4': { chant: 'にしがはち', display: 'に・し・が・はち' },
  '2x5': { chant: 'にごじゅう', display: 'に・ご・じゅう' },
  '2x6': { chant: 'にろくじゅうに', display: 'に・ろく・じゅう・に' },
  '2x7': { chant: 'にしちじゅうし', display: 'に・しち・じゅう・し' },
  '2x8': { chant: 'にはちじゅうろく', display: 'に・はち・じゅう・ろく' },
  '2x9': { chant: 'にくじゅうはち', display: 'に・く・じゅう・はち' },

  // 3の段
  '3x1': { chant: 'さんいちがさん', display: 'さん・いち・が・さん' },
  '3x2': { chant: 'さんにがろく', display: 'さん・に・が・ろく' },
  '3x3': { chant: 'さんさんがきゅう', display: 'さん・さん・が・きゅう' },
  '3x4': { chant: 'さんしじゅうに', display: 'さん・し・じゅう・に' },
  '3x5': { chant: 'さんごじゅうご', display: 'さん・ご・じゅう・ご' },
  '3x6': { chant: 'さんろくじゅうはち', display: 'さん・ろく・じゅう・はち' },
  '3x7': { chant: 'さんしちにじゅういち', display: 'さん・しち・に・じゅう・いち' },
  '3x8': { chant: 'さんぱにじゅうし', display: 'さん・ぱ・に・じゅう・し' },
  '3x9': { chant: 'さんくにじゅうしち', display: 'さん・く・に・じゅう・しち' },

  // 4の段
  '4x1': { chant: 'しいちがし', display: 'し・いち・が・し' },
  '4x2': { chant: 'しにがはち', display: 'し・に・が・はち' },
  '4x3': { chant: 'しさんじゅうに', display: 'し・さん・じゅう・に' },
  '4x4': { chant: 'ししじゅうろく', display: 'し・し・じゅう・ろく' },
  '4x5': { chant: 'しごにじゅう', display: 'し・ご・に・じゅう' },
  '4x6': { chant: 'しろくにじゅうし', display: 'し・ろく・に・じゅう・し' },
  '4x7': { chant: 'ししちにじゅうはち', display: 'し・しち・に・じゅう・はち' },
  '4x8': { chant: 'しはさんじゅうに', display: 'し・は・さん・じゅう・に' },
  '4x9': { chant: 'しくさんじゅうろく', display: 'し・く・さん・じゅう・ろく' },

  // 5の段
  '5x1': { chant: 'ごいちがご', display: 'ご・いち・が・ご' },
  '5x2': { chant: 'ごにじゅう', display: 'ご・に・じゅう' },
  '5x3': { chant: 'ごさんじゅうご', display: 'ご・さん・じゅう・ご' },
  '5x4': { chant: 'ごしにじゅう', display: 'ご・し・に・じゅう' },
  '5x5': { chant: 'ごごにじゅうご', display: 'ご・ご・に・じゅう・ご' },
  '5x6': { chant: 'ごろくさんじゅう', display: 'ご・ろく・さん・じゅう' },
  '5x7': { chant: 'ごしちさんじゅうご', display: 'ご・しち・さん・じゅう・ご' },
  '5x8': { chant: 'ごはちしじゅう', display: 'ご・はち・し・じゅう' },
  '5x9': { chant: 'ごくしじゅうご', display: 'ご・く・し・じゅう・ご' },

  // 6の段
  '6x1': { chant: 'ろくいちがろく', display: 'ろく・いち・が・ろく' },
  '6x2': { chant: 'ろくにじゅうに', display: 'ろく・に・じゅう・に' },
  '6x3': { chant: 'ろくさんじゅうはち', display: 'ろく・さん・じゅう・はち' },
  '6x4': { chant: 'ろくしにじゅうし', display: 'ろく・し・に・じゅう・し' },
  '6x5': { chant: 'ろくごさんじゅう', display: 'ろく・ご・さん・じゅう' },
  '6x6': { chant: 'ろくろくさんじゅうろく', display: 'ろく・ろく・さん・じゅう・ろく' },
  '6x7': { chant: 'ろくしちしじゅうに', display: 'ろく・しち・し・じゅう・に' },
  '6x8': { chant: 'ろくはちしじゅうはち', display: 'ろく・はち・し・じゅう・はち' },
  '6x9': { chant: 'ろっくごじゅうし', display: 'ろっく・ご・じゅう・し' },

  // 7の段
  '7x1': { chant: 'しちいちがしち', display: 'しち・いち・が・しち' },
  '7x2': { chant: 'しちにじゅうし', display: 'しち・に・じゅう・し' },
  '7x3': { chant: 'しちさんにじゅういち', display: 'しち・さん・に・じゅう・いち' },
  '7x4': { chant: 'しちしにじゅうはち', display: 'しち・し・に・じゅう・はち' },
  '7x5': { chant: 'しちごさんじゅうご', display: 'しち・ご・さん・じゅう・ご' },
  '7x6': { chant: 'しちろくしじゅうに', display: 'しち・ろく・し・じゅう・に' },
  '7x7': { chant: 'しちしちしじゅうく', display: 'しち・しち・し・じゅう・く' },
  '7x8': { chant: 'しちはちごじゅうろく', display: 'しち・はち・ご・じゅう・ろく' },
  '7x9': { chant: 'しちくろくじゅうさん', display: 'しち・く・ろく・じゅう・さん' },

  // 8の段
  '8x1': { chant: 'はちいちがはち', display: 'はち・いち・が・はち' },
  '8x2': { chant: 'はちにじゅうろく', display: 'はち・に・じゅう・ろく' },
  '8x3': { chant: 'はちさんにじゅうし', display: 'はち・さん・に・じゅう・し' },
  '8x4': { chant: 'はちしさんじゅうに', display: 'はち・し・さん・じゅう・に' },
  '8x5': { chant: 'はちごしじゅう', display: 'はち・ご・し・じゅう' },
  '8x6': { chant: 'はちろくしじゅうはち', display: 'はち・ろく・し・じゅう・はち' },
  '8x7': { chant: 'はちしちごじゅうろく', display: 'はち・しち・ご・じゅう・ろく' },
  '8x8': { chant: 'はっぱろくじゅうし', display: 'はっぱ・ろく・じゅう・し' },
  '8x9': { chant: 'はちくしちじゅうに', display: 'はち・く・しち・じゅう・に' },

  // 9の段
  '9x1': { chant: 'くいちがく', display: 'く・いち・が・く' },
  '9x2': { chant: 'くにじゅうはち', display: 'く・に・じゅう・はち' },
  '9x3': { chant: 'くさんにじゅうしち', display: 'く・さん・に・じゅう・しち' },
  '9x4': { chant: 'くしさんじゅうろく', display: 'く・し・さん・じゅう・ろく' },
  '9x5': { chant: 'くごしじゅうご', display: 'く・ご・し・じゅう・ご' },
  '9x6': { chant: 'くろくごじゅうし', display: 'く・ろく・ご・じゅう・し' },
  '9x7': { chant: 'くしちろくじゅうさん', display: 'く・しち・ろく・じゅう・さん' },
  '9x8': { chant: 'くはちしちじゅうに', display: 'く・はち・しち・じゅう・に' },
  '9x9': { chant: 'くくはちじゅういち', display: 'く・く・はち・じゅう・いち' }
};

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  color: string;
  cond: string;
}

export const stickersList: Sticker[] = [
  // 1. 各のだんの じゅんばんクリア (9個)
  { id: 'dan_order_1', name: 'ちびうんこ（1だん順）', emoji: '🌱💩', color: 'from-green-150 to-green-300', cond: '1のだんをじゅんばんでクリア' },
  { id: 'dan_order_2', name: 'ももいちごうんこ（2だん順）', emoji: '🍓💩', color: 'from-pink-150 to-pink-300', cond: '2のだんをじゅんばんでクリア' },
  { id: 'dan_order_3', name: 'みかんサクサクうんこ（3だん順）', emoji: '🍊💩', color: 'from-orange-150 to-orange-300', cond: '3のだんをじゅんばんでクリア' },
  { id: 'dan_order_4', name: 'メロンソーダうんこ（4だん順）', emoji: '🥤💩', color: 'from-teal-150 to-teal-300', cond: '4のだんをじゅんばんでクリア' },
  { id: 'dan_order_5', name: 'ハチミツぷにぷにうんこ（5だん順）', emoji: '🍯💩', color: 'from-yellow-150 to-amber-200', cond: '5のだんをじゅんばんでクリア' },
  { id: 'dan_order_6', name: 'ぶどうゼリーうんこ（6だん順）', emoji: '🍇💩', color: 'from-purple-150 to-purple-300', cond: '6のだんをじゅんばんでクリア' },
  { id: 'dan_order_7', name: 'チェリーきらきらうんこ（7だん順）', emoji: '🍒💩', color: 'from-rose-150 to-rose-300', cond: '7のだんをじゅんばんでクリア' },
  { id: 'dan_order_8', name: 'ピカピカぎんいろお星さま（8だん順）', emoji: '⭐💩', color: 'from-slate-200 to-zinc-300', cond: '8のだんをじゅんばんでクリア' },
  { id: 'dan_order_9', name: 'おうごんの王様うんこ（9だん順）', emoji: '👑💩', color: 'from-yellow-300 to-amber-400 font-bold', cond: '9のだんをじゅんばんでクリア' },

  // 2. 各のだんの バラバラクリア (9個)
  { id: 'dan_shuffle_1', name: 'どんぐりあつめうんこ（1だん乱）', emoji: '🪵💩', color: 'from-amber-200 to-amber-300', cond: '1のだんをバラバラでクリア' },
  { id: 'dan_shuffle_2', name: 'おさんぽワンちゃん（2だん乱）', emoji: '🐶💩', color: 'from-orange-200 to-yellow-200', cond: '2のだんをバラバラでクリア' },
  { id: 'dan_shuffle_3', name: 'おすわりコアラうんこ（3だん乱）', emoji: '🐨💩', color: 'from-slate-200 to-zinc-300', cond: '3のだんをバラバラでクリア' },
  { id: 'dan_shuffle_4', name: 'ふうせんぷにぷに（4だん乱）', emoji: '🎈💩', color: 'from-red-200 to-blue-200', cond: '4のだんをバラバラでクリア' },
  { id: 'dan_shuffle_5', name: 'おえかきクレヨン（5だん乱）', emoji: '🖍️💩', color: 'from-green-200 to-blue-200', cond: '5のだんをバラバラでクリア' },
  { id: 'dan_shuffle_6', name: 'おんがくメロディ（6だん乱）', emoji: '🎵💩', color: 'from-purple-200 to-pink-300', cond: '6のだんをバラバラでクリア' },
  { id: 'dan_shuffle_7', name: 'ラッキーフィーバー（7だん乱）', emoji: '🎰💩', color: 'from-amber-200 to-rose-300', cond: '7のだんをバラバラでクリア' },
  { id: 'dan_shuffle_8', name: 'うちゅう飛行士うんこ（8だん乱）', emoji: '🚀💩', color: 'from-indigo-200 to-purple-300', cond: '8のだんをバラバラでクリア' },
  { id: 'dan_shuffle_9', name: 'フェニックス不死鳥（9だん乱）', emoji: '🦅💩', color: 'from-red-300 to-amber-400 font-bold', cond: '9のだんをバラバラでクリア' },

  // 3. 各のだんの ぜんもんせいかい (9個)
  { id: 'perfect_dan_1', name: 'おひよこ1段完璧クリア（ひよこ）', emoji: '🐥💩', color: 'from-yellow-100 to-amber-200', cond: '1のだんを満点(9点)クリア！' },
  { id: 'perfect_dan_2', name: 'ロップイヤー2段完璧（うさぎ）', emoji: '🐰💩', color: 'from-pink-100 to-rose-200', cond: '2のだんを満点(9点)クリア！' },
  { id: 'perfect_dan_3', name: 'ミケねこ3段完璧クリア（ねこ）', emoji: '🐱💩', color: 'from-amber-100 to-orange-200', cond: '3のだんを満点(9点)クリア！' },
  { id: 'perfect_dan_4', name: 'トイプードル4段完璧（いぬ）', emoji: '🐶💩', color: 'from-yellow-200 to-amber-300', cond: '4のだんを満点(9点)クリア！' },
  { id: 'perfect_dan_5', name: 'ティラノサウルス5段（恐竜）', emoji: '🦖💩', color: 'from-emerald-100 to-teal-250', cond: '5のだんを満点(9点)クリア！' },
  { id: 'perfect_dan_6', name: 'おさるのウキキ6段完璧クリア', emoji: '🐵💩', color: 'from-amber-150 to-orange-300', cond: '6のだんを満点(9点)クリア！' },
  { id: 'perfect_dan_7', name: 'コロコロぱんだ7段完璧クリア', emoji: '🐼💩', color: 'from-slate-100 to-zinc-300', cond: '7のだんを満点(9点)クリア！' },
  { id: 'perfect_dan_8', name: 'キリンさん8段完璧クリア', emoji: '🦒💩', color: 'from-yellow-200 to-amber-350', cond: '8のだんを満点(9点)クリア！' },
  { id: 'perfect_dan_9', name: 'タテガミらいおん9段完璧クリア', emoji: '🦁💩', color: 'from-orange-200 to-amber-450 font-bold', cond: '9のだんを満点(9点)クリア！' },

  // 4. お仕事・なりきりシール (15個)
  { id: 'job_doctor', name: 'お医者さんうんこシール', emoji: '🩺💩', color: 'from-teal-100 to-cyan-205', cond: 'にがてを 1問いじょう こくふく！' },
  { id: 'job_firefighter', name: 'しょうぼうしうんこシール', emoji: '🚒💩', color: 'from-red-300 to-orange-400', cond: 'にがてを 3問いじょう こくふく！' },
  { id: 'job_police', name: 'お巡りさんうんこポリス', emoji: '👮💩', color: 'from-blue-400 to-indigo-600 text-white', cond: 'にがてを 8問いじょう こくふく！' },
  { id: 'job_astronaut', name: 'スター宇宙飛行士うんこ', emoji: '🧑‍🚀💩', color: 'from-slate-800 to-indigo-900 text-white', cond: 'いずれかの練習を10秒よりはやくクリア' },
  { id: 'job_ninja', name: 'ドロン！うんこお忍び忍者', emoji: '🥷💩', color: 'from-zinc-700 to-neutral-900 text-white', cond: 'いずれかの練習を15秒よりはやくクリア' },
  { id: 'job_wizard', name: '大まほうつかいマホうんこ', emoji: '🧙💩✨', color: 'from-purple-300 to-fuchsia-500 text-white', cond: '奇数段（1,3,5,7,9）のバラバラを全てクリア' },
  { id: 'job_dancer', name: 'フィーバーダンサーうんこ', emoji: '🕺💩💃', color: 'from-fuchsia-300 to-indigo-400', cond: '偶数段（2,4,6,8）のバラバラを全てクリア' },
  { id: 'job_guitarist', name: 'シャウト！ギタリストうんこ', emoji: '🎸💩', color: 'from-red-400 to-stone-800 text-yellow-101', cond: 'ちからだめしを 5回以上クリアする' },
  { id: 'job_dreamer', name: 'ファンタジーユニコーン', emoji: '🦄💩', color: 'from-pink-100 to-purple-200', cond: '5のだんをバラバラでクリアする' },
  { id: 'job_detective', name: 'めいたんてい謎解きデカ', emoji: '🕵️💩', color: 'from-amber-600 to-stone-700 text-yellow-50', cond: '練習を合計 25回いじょうクリア' },
  { id: 'job_pilot', name: '大ぞらのパイロットうんこ', emoji: '✈️💩', color: 'from-sky-305 to-blue-400 text-white', cond: 'ちからだめしを 3回いじょうクリア' },
  { id: 'job_chef', name: '三つ星レストランコック', emoji: '🧑‍🍳💩', color: 'from-amber-100 to-orange-200', cond: 'いつでも美味しくクリア！' },
  { id: 'job_farmer', name: 'もりもり元気いっぱいの農家', emoji: '👨‍🌾💩', color: 'from-yellow-100 to-green-200', cond: '合計クリア回数が 12回いじょうになる' },
  { id: 'job_artist', name: 'お絵かき天才えのぐ画匠', emoji: '🎨💩', color: 'from-purple-200 to-yellow-200', cond: '偶数の段をどれかクリア' },
  { id: 'job_programmer', name: 'ハッカー天才エンジニア', emoji: '💻💩', color: 'from-stone-850 to-emerald-800 text-emerald-300', cond: 'にがてを 10問いじょう こくふく！' },

  // 5. もぐもぐ食べ物うんこ (15個)
  { id: 'food_curry', name: 'うんこ激から本格カレー', emoji: '🍛💩', color: 'from-yellow-300 to-amber-500', cond: '九九の練習を 3回以上クリアする' },
  { id: 'food_ice', name: 'ダブルいちごソフトうんこ', emoji: '🍦💩', color: 'from-pink-150 to-cyan-150', cond: '3のと6のだんバラバラを両方クリア' },
  { id: 'food_cake', name: 'お誕生日おめでとうケーキ', emoji: '🎂💩', color: 'from-red-100 to-pink-100', cond: '九九を合計 15回以上クリア' },
  { id: 'food_melon', name: 'あま〜いメロンシューうんこ', emoji: '🍈💩', color: 'from-green-100 to-yellow-100', cond: '4段と5段をじゅんばんでクリア' },
  { id: 'food_ramen', name: '大盛りネギ醤油ラーメン', emoji: '🍜💩', color: 'from-amber-200 to-orange-355', cond: 'いずれかの段を 20秒以内にクリア' },
  { id: 'food_sushi', name: 'へいお待ち！大トロうんこ寿し', emoji: '🍣💩', color: 'from-rose-150 to-red-400', cond: 'バラバラ練習を 5回いじょうクリア' },
  { id: 'food_potato', name: 'アツアツ山盛りポテトフライ', emoji: '🍟💩', color: 'from-yellow-250 to-amber-350', cond: 'じゅんばん練習を 5回いじょうクリア' },
  { id: 'food_tapioca', name: 'もちもちストロベリータピオカ', emoji: '🧋💩', color: 'from-pink-100 to-stone-300', cond: 'ちからだめしで 8問以上せいかい' },
  { id: 'food_parfait', name: 'ジャンボ贅沢いちごパフェ', emoji: '🍧💩', color: 'from-pink-200 to-rose-300', cond: 'ぜんもんせいかいを 5回以上だす' },
  { id: 'food_choco', name: 'トロピカルカカオチョコレート', emoji: '🍫💩', color: 'from-stone-605 to-stone-800 text-white', cond: '2段と4段と8段をクリアする' },
  { id: 'food_takoyaki', name: 'ピピっと熱いたこ焼きソース', emoji: '🐙💩', color: 'from-amber-400 to-red-400', cond: '6のだんで満点(9/9)クリア！' },
  { id: 'food_burger', name: 'ダブルお肉チーズバーガー', emoji: '🍔💩', color: 'from-amber-600 to-yellow-600 text-white', cond: '合計クリア回数が 35回いじょうになる' },
  { id: 'food_donut', name: 'あまあまオールドファッション', emoji: '🍩💩', color: 'from-pink-200 to-amber-300', cond: '3のだんで満点(9/9)クリア！' },
  { id: 'food_pizza', name: 'チーズとろーりマルゲリータ', emoji: '🍕💩', color: 'from-orange-300 to-red-500', cond: '4のだんで満点(9/9)クリア！' },
  { id: 'food_pudding', name: 'ぷるぷる極上プリンうんこ', emoji: '🍮💩', color: 'from-yellow-150 to-amber-300', cond: '5のだんで満点(9/9)クリア！' },

  // 6. どうぶつうんこ (15個)
  { id: 'animal_cat', name: 'ドラ猫おねだりうんこ', emoji: '🐱💩', color: 'from-amber-100 to-yellow-200', cond: '3のだんをクリアする' },
  { id: 'animal_dog', name: 'トコトコしばいぬうんこ', emoji: '🐶💩', color: 'from-amber-100 to-orange-200', cond: '4のだんをクリアする' },
  { id: 'animal_lion', name: 'ガオーン大吠えライオンうんこ', emoji: '🦁💩', color: 'from-orange-300 to-amber-450 font-bold', cond: '8のだんをぜんもんせいかい' },
  { id: 'animal_panda', name: 'もぐもぐ可愛い笹パンダ', emoji: '🐼💩', color: 'from-slate-100 to-slate-300', cond: '7のだんをクリアする' },
  { id: 'animal_penguin', name: 'ペンギンのすべり台うんこ', emoji: '🐧💩', color: 'from-sky-100 to-cyan-205', cond: 'あさ10じよりまえにクリア' },
  { id: 'animal_frog', name: 'ケロケロ梅雨あめカエル', emoji: '🐸💩', color: 'from-green-100 to-teal-200', cond: '6のだんをクリアする' },
  { id: 'animal_koala', name: 'コアラのユーカリしがみつき', emoji: '🐨💩', color: 'from-slate-200 to-zinc-350', cond: '5のだんをクリアする' },
  { id: 'animal_dragon', name: 'ドラゴン大噴火ブラックうんこ', emoji: '🐉💩', color: 'from-red-600 to-stone-900 text-yellow-200', cond: '9のだんバラバラをクリア' },
  { id: 'animal_rabbit', name: 'ピョンピョン跳び箱うさぎ', emoji: '🐰💩', color: 'from-pink-100 to-rose-200', cond: '2のだんをクリアする' },
  { id: 'animal_bear', name: '森のクマさんおひざうんこ', emoji: '🐻💩', color: 'from-amber-500 to-stone-600 text-white', cond: '練習を 10回いじょうクリアする' },
  { id: 'animal_monkey', name: 'おさるの温泉ぽかぽかうんこ', emoji: '🐵💩', color: 'from-yellow-150 to-amber-200', cond: '1のだんをクリアする' },
  { id: 'animal_tiger', name: 'ガオー！白のベンガルトラ', emoji: '🐯💩', color: 'from-yellow-400 to-orange-500 font-bold', cond: '練習を 18回いじょうクリアする' },
  { id: 'animal_pig', name: 'トントンぶたさん貯金うんこ', emoji: '🐷💩', color: 'from-pink-100 to-pink-200', cond: '1のだんをぜんもんせいかい' },
  { id: 'animal_hamster', name: 'ハムバグひまわりの種コチコチ', emoji: '🐹💩', color: 'from-amber-50 to-yellow-150', cond: '2のだんをぜんもんせいかい' },
  { id: 'animal_shark', name: '大あごシャーク深海ハッピー', emoji: '🦈💩', color: 'from-slate-350 to-blue-405 text-white', cond: '最高クリアタイムが15秒以下になる' },

  // 7. スポーツうんこ (15個)
  { id: 'sports_soccer', name: 'ミラクルボレーサッカーうんこ', emoji: '⚽💩', color: 'from-blue-400 to-indigo-600 text-white', cond: '九九を合算で 10回以上クリア' },
  { id: 'sports_baseball', name: '場外ホームラン白球うんこ', emoji: '⚾💩', color: 'from-stone-50 to-orange-100', cond: '8のだんバラバラをクリア' },
  { id: 'sports_swimming', name: 'スイスイバタフライうんこ', emoji: '🏊💩', color: 'from-sky-100 to-cyan-300', cond: '2段と5段の両方バラバラをクリア' },
  { id: 'sports_tennis', name: '音速ボレー！エナジーうんこ', emoji: '🎾💩', color: 'from-lime-150 to-emerald-300', cond: '練習を合計 30回以上クリア' },
  { id: 'sports_boxing', name: '鋼鉄のパンチチャンプうんこ', emoji: '🥊💩', color: 'from-red-500 to-stone-850 text-white', cond: 'ちからだめしを 25秒以内にクリア' },
  { id: 'sports_skate', name: 'キックフリップ！反発スケボー', emoji: '🛹💩', color: 'from-purple-200 to-pink-300', cond: 'いずれかの練習を 12秒以内にクリア' },
  { id: 'sports_basket', name: '宙を舞うダンク！NBAうんこ', emoji: '🏀💩', color: 'from-orange-300 to-red-500 text-white', cond: '練習を合計 8回以上クリア' },
  { id: 'sports_golf', name: 'ホールインワン神芝うんこ', emoji: '⛳💩', color: 'from-green-100 to-emerald-300', cond: 'にがてな問題を 5問以上こくふく' },
  { id: 'sports_ski', name: 'シュプールえがく雪山すべり', emoji: '⛷️💩', color: 'from-sky-50 to-teal-100', cond: 'あさ10じ（午前10時）よりまえにクリア' },
  { id: 'sports_marathon', name: '限界突破！ホノルルマラソン', emoji: '🏃💩', color: 'from-orange-200 to-teal-200', cond: '九九の練習を 40回以上クリア' },
  { id: 'sports_judo', name: '背負い投げ！黒帯畳うんこ', emoji: '🥋💩', color: 'from-slate-100 to-stone-300', cond: 'ちからだめしを1回でもクリアする' },
  { id: 'sports_sumo', name: '横綱！大関関取どすこいうんこ', emoji: '👑💩', color: 'from-yellow-300 to-amber-505 font-bold', cond: '9のだんをぜんもんせいかい' },
  { id: 'sports_bowling', name: 'パーフェクトゲームボウラー', emoji: '🎳💩', color: 'from-red-100 to-neutral-200', cond: 'ぜんもんせいかいを 2回以上だす' },
  { id: 'sports_curling', name: 'ブラシでゴシゴシ氷そりすべり', emoji: '🥌💩', color: 'from-sky-100 to-indigo-200', cond: '3のだんをバラバラでクリア' },
  { id: 'sports_cycling', name: 'ツール・ド・うんこ大ロード', emoji: '🚴💩', color: 'from-cyan-200 to-emerald-300', cond: '練習を 20回いじょうクリアする' },

  // 8. うちゅうと自然うんこ (15個)
  { id: 'space_alien', name: 'キラキラ未知のエイリアン', emoji: '👽💩', color: 'from-lime-300 to-green-500 text-white', cond: '夕方17時よりもあとにクリア' },
  { id: 'space_ufo', name: 'アブダクションUFO光線うんこ', emoji: '🛸💩', color: 'from-indigo-300 to-fuchsia-600 text-white', cond: 'ちからだめしを 15秒以内にクリア' },
  { id: 'nature_volcano', name: 'マグマもえもえ大噴火うんこ', emoji: '🌋💩', color: 'from-red-500 to-orange-600 text-white', cond: 'ぜんもんせいかい 10回以上だす' },
  { id: 'nature_snowflake', name: '雪の結晶パウダーうんこチビ', emoji: '❄️💩', color: 'from-sky-50 to-cyan-150', cond: 'あさ10じよりもまえにクリア' },
  { id: 'nature_thunder', name: '稲妻ビリビリ！カミナリうんこ', emoji: '⚡💩', color: 'from-yellow-250 to-orange-400 font-bold', cond: 'いずれかの練習を 14秒以内にクリア' },
  { id: 'nature_meteor', name: '爆走スペースハピ隕石うんこ', emoji: '☄️💩', color: 'from-red-405 to-stone-900 text-white', cond: 'ちからだめしのタイム35秒以下をだす' },
  { id: 'nature_wormhole', name: 'ワープホール時空ネジレうんこ', emoji: '🕳️💩', color: 'from-stone-900 to-purple-900 text-white', cond: 'ちからだめしのタイム30秒以下をだす' },
  { id: 'nature_sun', name: 'ギラギラ爆炎おひさまうんこ', emoji: '☀️💩', color: 'from-red-400 to-orange-400 text-white', cond: 'すべての段でじゅんばんをクリア' },
  { id: 'nature_moon', name: 'キラキラお星さまと三日月うんこ', emoji: '🌙💩', color: 'from-indigo-900 to-yellow-300 text-yellow-101', cond: '練習を合計 50回以上クリア' },
  { id: 'nature_earth', name: 'エメラルドグリーンの地球うんこ', emoji: '🌍💩', color: 'from-blue-300 to-emerald-300', cond: 'すべての段でバラバラをクリア' },
  { id: 'nature_rainbow', name: 'キセキのダブルレインボーうんこ', emoji: '🌈💩', color: 'from-pink-100 via-green-100 to-sky-100', cond: 'すべての段で星3つにする（満点！）' },
  { id: 'nature_galaxy', name: 'スペース銀河アチーブうんこ', emoji: '🌌💩', color: 'from-purple-800 to-black text-white', cond: '九九の練習を 100回いじょうクリア' },
  { id: 'nature_aurora', name: '神秘の北極オーロラカーテン', emoji: '🔮💩', color: 'from-cyan-200 to-purple-305', cond: '九九の練習を 75回いじょうクリア' },
  { id: 'nature_cloud', name: 'ふわふわ夏の入道雲うんこ', emoji: '☁️💩', color: 'from-blue-50 to-sky-100', cond: '2のだんをじゅんばんでクリア' },
  { id: 'nature_fire', name: 'もえさかる焚き火ぽかぽかうに', emoji: '🔥💩', color: 'from-red-400 to-orange-405 text-white', cond: '3のだんをじゅんばんでクリア' },

  // 9. おもしろ感情うんこ (15個)
  { id: 'emoji_smile', name: 'ニコニコハッピーうんこシール', emoji: '😊💩', color: 'from-yellow-105 to-yellow-250', cond: '練習を合計 2回いじょうクリアする' },
  { id: 'emoji_angry', name: 'プンプンお怒りうんこシール', emoji: '😡💩', color: 'from-red-300 to-red-500 text-white', cond: '九九の練習を 5回いじょうクリアする' },
  { id: 'emoji_cry', name: 'えーん大泣きしょんぼりうんこ', emoji: '😢💩', color: 'from-sky-100 to-blue-200', cond: 'まちがえた問題をにがてリストに１回いれる' },
  { id: 'emoji_shock', name: 'ガガーン！地球壊滅おどろき丸', emoji: '😲💩', color: 'from-cyan-205 to-emerald-205', cond: 'ちからだめしを 1回いじょうクリアする' },
  { id: 'emoji_sleep', name: 'スースーぐっすり夢心地ねんね', emoji: '😴💩', color: 'from-indigo-100 to-indigo-250 text-indigo-900', cond: '午後17時（夕方5時）よりあとにクリア' },
  { id: 'emoji_zombie', name: 'ドロバケお墓からアタックゾンビ', emoji: '🧟💩', color: 'from-green-500 to-stone-700 text-green-100', cond: '弱点を克服したクリア実績をもつ' },
  { id: 'emoji_fart', name: '屁の突っ張り！おならガスうんこ', emoji: '💨💩', color: 'from-slate-100 to-zinc-250', cond: 'いずれかの練習を 16秒以内にクリア' },
  { id: 'job_glasses', name: 'あたまピカリ！天才IQうんこ', emoji: '👓💩', color: 'from-indigo-50 to-indigo-150', cond: 'ちからだめしで 9問以上せいかい' },
  { id: 'emoji_sparkle', name: 'おきらきらラメうんこシール', emoji: '✨💩', color: 'from-yellow-105 to-amber-205 text-amber-950 font-bold', cond: 'ぜんもんせいかいを 3回いじょうだす' },
  { id: 'emoji_wink', name: 'ニコニコえがおのウインクプリン', emoji: '😉💩', color: 'from-pink-100 to-rose-200', cond: 'ぜんもんせいかいを 4回いじょうだす' },
  { id: 'emoji_cool', name: 'グラサンかけたワルうんこシール', emoji: '😎💩', color: 'from-stone-605 to-stone-800 text-white', cond: '練習を 15回いじょうクリアする' },
  { id: 'emoji_gasp', name: 'はわわ！プチ大あわてうんこ', emoji: '😰💩', color: 'from-sky-200 to-teal-150', cond: '練習を合計3回いじょうクリア' },
  { id: 'emoji_heart_eyes', name: '目がハート！大すきラブずきゅん', emoji: '😍💩', color: 'from-pink-150 to-rose-250', cond: 'ぜんもんせいかいを 8回いじょうだす' },
  { id: 'emoji_party', name: 'お祝いクラッカーフェスうんこ', emoji: '🎉💩', color: 'from-yellow-150 to-cyan-150', cond: 'ぜんもんせいかいを 12回いじょうだす' },
  { id: 'emoji_bored', name: 'ふぅ、お疲れさまのため息うんこ', emoji: '🥱💩', color: 'from-zinc-100 to-slate-200', cond: '夜21時以降にクリアする' },

  // 10. やりこみ・記念アチーブメント (15個)
  { id: 'order_all', name: '初代！うんこ九九大王シール', emoji: '👑💩', color: 'from-yellow-405 to-amber-500 font-extrabold border-2 border-yellow-300', cond: 'すべての段で「じゅんばん」をクリア！' },
  { id: 'shuffle_all', name: '究極サクラ虹グラデうんこ神', emoji: '🌈💩', color: 'from-teal-300 via-pink-200 to-indigo-500 font-extrabold border-2 border-pink-200', cond: 'すべての段で「バラバラ」をクリア！' },
  { id: 'perfect_challenge', name: '王座・ちからだめし神サマの神託', emoji: '🏆💩', color: 'from-purple-400 to-indigo-600 text-yellow-101 font-extrabold border-2 border-yellow-300', cond: 'ちからだめしで満点(10問)をだす！' },
  { id: 'play_1', name: 'はじめのぷにっと一歩シール', emoji: '🚼💩', color: 'from-slate-100 to-slate-200', cond: '練習を 1回いじょう クリアする' },
  { id: 'play_5', name: 'うんこプチプリンス勲章シール', emoji: '👶💩', color: 'from-blue-200 to-cyan-300', cond: '練習を 5回いじょう クリアする' },
  { id: 'play_15', name: '貫禄バッチリ！うんこもりもり大将', emoji: '🏢💩', color: 'from-amber-400 to-orange-500 text-white font-bold', cond: '練習を 15回いじょう クリアする' },
  { id: 'play_30', name: '九九を知り尽くしたうんこ大仙人', emoji: '🧙💩', color: 'from-zinc-200 to-zinc-400', cond: '練習を 30回いじょう クリアする' },
  { id: 'play_50', name: '銀河を統べるハッピーうんこ星王', emoji: '🌌💩', color: 'from-fuchsia-600 to-indigo-900 text-white font-bold', cond: '練習を 50回いじょう クリアする' },
  { id: 'play_100', name: '全日本うんこギガ神話神殿大賞', emoji: '🪐💩🪐', color: 'from-pink-500 via-fuchsia-500 to-indigo-755 text-white font-extrabold border border-yellow-201', cond: '練習を 100回クリア（すごすぎる！）' },
  { id: 'perfect_1', name: '初ピカドン！全問正解きらきら', emoji: '🌟💩', color: 'from-yellow-100 to-amber-200', cond: 'ぜんもんせいかいを 1回だす！' },
  { id: 'perfect_3', name: 'お祝いトリプル・ゴールドうんこ', emoji: '🔥💩', color: 'from-red-400 to-orange-500 text-white font-bold', cond: 'ぜんもんせいかいを 3回いじょう だす' },
  { id: 'perfect_10', name: '殿堂入りキングオブうんこスター', emoji: '👑💩👑', color: 'from-yellow-250 to-indigo-400 text-zinc-900 font-extrabold', cond: 'ぜんもんせいかいを 10回いじょう だす' },
  { id: 'perfect_25', name: '不落マスマティカパーフェクト盤石', emoji: '💎💩', color: 'from-cyan-400 to-teal-400 text-white font-bold', cond: 'ぜんもんせいかいを 25回いじょうクリア！' },
  { id: 'perfect_50', name: '全知全能のうんこ大明神さま降臨', emoji: '🔱💩🔱', color: 'from-red-400 via-yellow-250 to-blue-500 text-white font-extrabold border-2 border-white', cond: 'ぜんもんせいかいを 50回いじょう（神の領域）' },
  { id: 'weak_all_zero', name: 'にがて完全ピカピカおそうじ大王', emoji: '🧼🚽', color: 'from-teal-300 to-emerald-400 text-white font-bold', cond: 'にがてな問題を完全に 0問 にする！' },
];

export function getKukuChantQuestion(chantDisplay: string, clean: boolean = false): string {
  const parts = chantDisplay.split('・');
  const gaIndex = parts.indexOf('が');
  if (gaIndex !== -1) {
    return parts.slice(0, gaIndex + 1).join(clean ? '' : '・') + (clean ? '❓' : '・❓');
  } else {
    return parts.slice(0, 2).join(clean ? '' : '・') + (clean ? '❓' : '・❓');
  }
}

export function getKukuItem(multiplicand: number, multiplier: number): KukuItem {
  const formulaKey = `${multiplicand}x${multiplier}`;
  const item = kukuChantData[formulaKey] || { chant: '', display: '' };
  return {
    multiplicand,
    multiplier,
    answer: multiplicand * multiplier,
    chant: item.chant,
    chantDisplay: item.display
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateRowQuestions(dan: number, type: 'order' | 'shuffle' = 'order'): KukuItem[] {
  const items: KukuItem[] = [];
  for (let b = 1; b <= 9; b++) {
    items.push(getKukuItem(dan, b));
  }
  if (type === 'shuffle') {
    return shuffleArray(items);
  }
  return items;
}
