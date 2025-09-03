import { getTMArgs } from './init.js';

interface CLI {
  /**
   * @returns The arguments for the Turing machine.
   * @throws Error if the arguments are not specified or incorrect.
   */
  getTMArgs: typeof getTMArgs;
}

export const cli: CLI = {
  getTMArgs,
};
