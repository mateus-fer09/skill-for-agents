#!/usr/bin/env node

import { run } from '../src/index.js';

run().catch((err) => {
  console.error('\nOcorreu um erro ao executar skill-for-agents:');
  console.error(err);
  process.exit(1);
});
