import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { weatherAgent } from './agents';
import { anagramGeneratorAgent } from './agents/anagram-agent';

export const mastra = new Mastra({
  agents: { weatherAgent, anagramGeneratorAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});

