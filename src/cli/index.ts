import { getDebuggeeArgs, init } from './init.js';

interface CLI {
  /**
   * @returns The arguments for the Turing machine.
   * @throws Error if the arguments are not specified or incorrect.
   */
  getDebuggeeArgs: typeof getDebuggeeArgs;

  /**
   * Initialize the commander program instance and returns it.
   */
  init: typeof init;
}

export const cli: CLI = {
  getDebuggeeArgs,
  init,
};
