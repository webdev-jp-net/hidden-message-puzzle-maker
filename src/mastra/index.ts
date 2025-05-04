import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { anagramGeneratorAgent } from './agents/anagram-agent';
import { textToImageAgent } from './agents/text-to-image-agent';

export const mastra = new Mastra({
  agents: { anagramGeneratorAgent, textToImageAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});

