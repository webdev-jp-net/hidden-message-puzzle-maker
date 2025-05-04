import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const FONT_FAMILY = "Murecho, sans-serif";
const FONT_WEIGHT = "700";
const FONT_SIZE = 18;
const CHAR_WIDTH = 18;
const CHARS_PER_LINE = 18;
const LINE_HEIGHT = 40;
const MARGIN = 36;
const COLORS = {
  black: "#000000",
  red: "#FF0000",
  blue: "#0000FF",
};

export const textToImageTool = createTool({
  id: "text-to-image",
  description: "色付きテキスト配列から謎解き用SVG画像を生成します",
  inputSchema: z.object({
    textData: z.array(
      z.object({
        text: z.string(),
        color: z.enum(["black", "red", "blue"]),
      })
    ),
  }),
  outputSchema: z.object({
    imageSvg: z.string(),
  }),
  execute: async ({ context }) => {
    const totalChars = context.textData.reduce((sum, item) => sum + item.text.length, 0);
    const lines = Math.ceil(totalChars / CHARS_PER_LINE);
    const width = CHAR_WIDTH * CHARS_PER_LINE + MARGIN * 2;
    const height = LINE_HEIGHT * lines + MARGIN * 2;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" style="background:#fff">`;
    svg += `<rect width="100%" height="100%" fill="#fff"/>`;

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
        svg += `<text x="${x}" y="${y + FONT_SIZE}" font-family="${FONT_FAMILY}" font-weight="${FONT_WEIGHT}" font-size="${FONT_SIZE}" fill="${color}">${char}</text>`;
        x += CHAR_WIDTH;
        currentLineChars++;
      }
    }
    svg += `</svg>`;

    return { imageSvg: svg };
  },
});
