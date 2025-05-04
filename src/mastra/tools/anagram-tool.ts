import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// 基本的な日本語の単語リスト（実際の実装ではより大きなデータベースを使用することを推奨）
const wordList = [
  "あたま", "いけん", "うみべ", "えほん", "おかし",
  "かえる", "きもち", "くすり", "けしき", "こころ",
  "さくら", "しごと", "すなお", "せかい", "そらま",
  "たから", "ちから", "つくえ", "てぶくろ", "とけい",
  "なみだ", "にわとり", "ぬのじ", "ねむり", "のはら",
  "はなび", "ひかり", "ふゆき", "へいわ", "ほしぞら",
  "まくら", "みかん", "むすめ", "めがね", "もみじ",
  "やさい", "ゆびわ", "よろこび", "わらい"
];

const countChars = (str: string) => [...str].length;

const isPalindrome = (str: string) => {
  const chars = [...str];
  return chars.join('') === chars.reverse().join('');
};

const isValidWord = (word: string): boolean => {
  const length = countChars(word);
  return (
    length >= 3 && 
    length <= 8 && 
    !isPalindrome(word) && 
    !word.includes(' ') && 
    wordList.includes(word)
  );
};

const getRandomWords = (count: number): { word: string, score: number }[] => {
  const result = new Set<string>();
  const lengthDistribution = new Map<number, number>();
  
  // 文字数ごとの目標数を設定
  for (let len = 3; len <= 8; len++) {
    lengthDistribution.set(len, Math.max(1, Math.floor(count / 6)));
  }
  
  while (result.size < count) {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    const length = countChars(word);
    
    if (isValidWord(word) && !result.has(word)) {
      const currentCount = lengthDistribution.get(length) || 0;
      if (currentCount > 0) {
        result.add(word);
        lengthDistribution.set(length, currentCount - 1);
      }
    }
  }
  
  return Array.from(result).map(word => ({
    word,
    score: countChars(word)
  }));
};

export const anagramGeneratorTool = createTool({
  id: "generate-anagram-words",
  description: "アナグラムゲーム用の出題ワードを生成します",
  inputSchema: z.object({
    count: z.number().min(1).max(20).describe("生成するワードの数"),
  }),
  outputSchema: z.array(z.object({
    word: z.string(),
    score: z.number()
  })),
  execute: async ({ context }) => {
    const results = getRandomWords(context.count);
    return results.sort((a, b) => a.score - b.score);
  },
}); 