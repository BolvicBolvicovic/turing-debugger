import { DebuggeeArgs } from './cli.types.js';

export function getDebuggeeArgs(): DebuggeeArgs {
  const asString = process.argv.filter((_, i) => i > 1).join(' ');

  if (!asString || process.argv.length !== 4) {
    throw new Error(`Debuggee arguments incorrect!\nDebuggee's arguments: ${asString}`);
  }

  return {
    machinePath: process.env.NODE_TM_PATH! + '/' + process.argv[2].trim().split('/').join('/'),
    machineInput: process.argv[3],
    asString,
  };
}
