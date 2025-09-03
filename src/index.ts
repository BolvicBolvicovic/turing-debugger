#! /usr/bin/env node
import 'dotenv/config';
import { cli } from './cli/index.js';
import { debuggee as debuggeeLib } from './debuggee/index.js';
import { parser } from './utils/parser.js';

const debuggeeArgs = cli.getTMArgs();
const debuggee = debuggeeLib.launch(process.env.NODE_TM_PATH!, debuggeeArgs.asString);
const machine = parser.turingMachine(debuggeeArgs.machinePath);

try {
  debuggeeLib.setup(await debuggee);

  console.log('Turing Machine loaded successfully:', JSON.stringify(await machine));
} catch (error) {
  console.error('Debuggee error:', error);
} finally {
  debuggeeLib.cleanup(await debuggee);
}
