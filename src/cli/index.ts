import { getDebuggeeArgs } from './init.js';

interface CLI {
  /**
   * @returns The arguments for the Turing machine.
   * @throws Error if the arguments are not specified or incorrect.
   */
  getDebuggeeArgs: typeof getDebuggeeArgs;
}

export const cli: CLI = {
  getDebuggeeArgs,
};
