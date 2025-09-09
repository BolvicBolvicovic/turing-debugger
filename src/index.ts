#! /usr/bin/env node
import 'dotenv/config';
import React from 'react';
import { render } from 'ink';
import { cli } from './cli/index.js';
import { debuggee as debuggeeLib } from './debuggee/index.js';
import { parser } from './utils/parser.js';
import { Root } from './ui/root.js';
import { lib } from './utils/lib.js';

const program = cli.init();
// TODO: refactor or change the name of getDebuggeeArgs
const debuggeeArgs = cli.getDebuggeeArgs();
const debuggee = debuggeeLib.launch(process.env.NODE_TM_PATH!, debuggeeArgs.asString);
const machine = parser.turingMachine(debuggeeArgs.machinePath);

try {
  debuggeeLib.setup(await debuggee);

  lib.clearScreen();

  // Specific case linked to the assembly compiler
  const startMem = await machine.then(m => m.states.find(s => s === '_start_mem'));
  if (startMem) {
    debuggeeArgs.machineInput = '#' + debuggeeArgs.machineInput;
  }

  const { waitUntilExit } = render(
    React.createElement(Root, {
      machine: await machine,
      debuggeeArgs,
      assemblyFile: program.opts().assemblyFile?.split('/').pop(),
    })
  );

  await waitUntilExit();
} catch (error) {
  console.error('Debuggee error:', error);
} finally {
  debuggeeLib.cleanup(await debuggee);
}
