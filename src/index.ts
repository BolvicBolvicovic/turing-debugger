#! /usr/bin/env node
import 'dotenv/config';
import React from 'react';
import { render } from 'ink';
import { cli } from './cli/index.js';
import { debuggee as debuggeeLib } from './debuggee/index.js';
import { parser } from './utils/parser.js';
import { DebuggerApp } from './ui/index.js';

const debuggeeArgs = cli.getTMArgs();
const debuggee = debuggeeLib.launch(process.env.NODE_TM_PATH!, debuggeeArgs.asString);
const machine = parser.turingMachine(debuggeeArgs.machinePath);

try {
  debuggeeLib.setup(await debuggee);

  // Interactive terminal UI displaying the machine and debuggee state with graceful quit
  const { waitUntilExit } = render(
    React.createElement(DebuggerApp, {
      machine: await machine,
      debuggee: await debuggee,
    })
  );

  await waitUntilExit();
} catch (error) {
  console.error('Debuggee error:', error);
} finally {
  debuggeeLib.cleanup(await debuggee);
}
