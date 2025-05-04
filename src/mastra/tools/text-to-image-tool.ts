import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createCanvas, registerFont } from "canvas";
import path from "path";

// FontsourceからMurecho Boldのパスを取得
const FONT_PATH = require.resolve("@fontsource/murecho/files/murecho-japanese-700-normal.woff");
registerFont(FONT_PATH, { family: "Murecho", weight: "700" });

const FONT_FAMILY = "Murecho";
const FONT_WEIGHT = "700";
const FONT_SIZE = 18;
const CHAR_WIDTH = 18;
const CHARS_PER_LINE = 18;
const LINE_HEIGHT = 40; // 1.2倍
const MARGIN = 36;
const COLORS = {
  black: "#000000",
  red: "#FF0000",
  blue: "#0000FF",
};

export const textToImageTool = createTool({
  id: "text-to-image",
  description: "色付きテキスト配列から謎解き用画像(PNG)を生成します",
  inputSchema: z.object({
    textData: z.array(
      z.object({
        text: z.string(),
        color: z.enum(["black", "red", "blue"]),
      })
    ),
  }),
  outputSchema: z.object({
    imageBase64: z.string(),
  }),
  execute: async ({ context }) => {
    // 総文字数から行数を計算
    const totalChars = context.textData.reduce((sum, item) => sum + item.text.length, 0);
    const lines = Math.ceil(totalChars / CHARS_PER_LINE);
    const width = CHAR_WIDTH * CHARS_PER_LINE + MARGIN * 2;
    const height = LINE_HEIGHT * lines + MARGIN * 2;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.antialias = "subpixel";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${FONT_WEIGHT} ${FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.textBaseline = "top";

    let x = MARGIN;
    let y = MARGIN;
    let currentLineChars = 0;

    for (const item of context.textData) {
      const color = COLORS[item.color];
      for (const char of item.text) {
        if (currentLineChars >= CHARS_PER_LINE) {
          x = MARGIN;
          y += LINE_HEIGHT;
          currentLineChars = 0;
        }
        ctx.fillStyle = color;
        ctx.fillText(char, x, y);
        x += CHAR_WIDTH;
        currentLineChars++;
      }
    }

    const imageBase64 = canvas.toBuffer("image/png").toString("base64");
    return { imageBase64 };
  },
});
