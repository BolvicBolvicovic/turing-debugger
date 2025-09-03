import { TMArgs } from './cli.types.js';

export function getTMArgs(): TMArgs {
  const asString = process.argv.filter((_, i) => i > 2).join(' ');

  if (!asString || process.argv.length !== 5) {
    throw new Error(`Turing machine arguments incorrect!\nTuring machine's arguments: ${asString}`);
  }

  return {
    machinePath: process.env.NODE_TM_PATH! + '/' + process.argv[3].trim().split('/').join('/'),
    machineInput: process.argv[4],
    asString,
  };
}
