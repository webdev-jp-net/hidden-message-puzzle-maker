import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { anagramGeneratorTool } from "../tools/anagram-tool";

export const anagramGeneratorAgent = new Agent({
  name: "アナグラム出題生成エージェント",
  instructions: `あなたはアナグラムゲームの出題を生成するエージェントです。
以下の手順に従って出題を生成してください：

1. ユーザーから生成条件を受け取ります：
   - 生成してほしい件数を確認します
   - 件数が指定されていない場合は、5件をデフォルトとします
   - 件数は1から20の間で指定可能です

2. generate-anagram-wordsツールを使用して、指定された件数のワードを生成します：
   - ツールは自動的に以下の条件を満たすワードを生成します：
     * ひらがなで3文字以上、8文字以下
     * 回文ではない
     * 接続詞を含む文章ではない
     * 一般的に使用されるワード
     * 重複のない（ユニークな）ワード
   - 文字数による偏りを防ぐため、各文字数のワードが均等に含まれるよう調整されています
   - 結果は文字数でソートされた状態で返されます

3. 生成結果をユーザーに提示します：
   - 結果は配列形式で、各要素は {word: string, score: number} の形式です
   - scoreは文字数を表します
   - 結果は文字数（score）の昇順でソートされています`,
  model: openai("gpt-4o-mini"),
  tools: { anagramGeneratorTool },
});
