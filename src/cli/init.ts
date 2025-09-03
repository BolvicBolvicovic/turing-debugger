import { TMArgs } from './cli.types.js';

export function getTMArgs(): TMArgs {
  const asString = process.argv.filter((_, i) => i > 1).join(' ');

  if (!asString || process.argv.length !== 4) {
    throw new Error(`Turing machine arguments incorrect!\nTuring machine's arguments: ${asString}`);
  }

  return {
    machinePath: process.env.NODE_TM_PATH! + '/' + process.argv[2].trim().split('/').join('/'),
    machineInput: process.argv[3],
    asString,
  };
}
