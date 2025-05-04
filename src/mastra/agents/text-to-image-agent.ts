import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { textToImageTool } from '../tools';

export const textToImageAgent = new Agent({
  name: 'TextToImageデバッグエージェント',
  instructions: `
    あなたはテキストを画像化するツールのデバッグ用エージェントです。
    入力例:
    textData: [
      { text: "今日は", color: "black" },
      { text: "ひみつ", color: "red" },
      { text: "の日記です。", color: "black" }
    ]
    入力内容に従い、textToImageToolを呼び出して画像を生成してください。
    出力はBase64 PNG画像です。
  `,
  model: openai('gpt-4o'),
  tools: { textToImageTool },
});
