import { clearScreen, getDebuggeeArgs, init, resizeTerminal } from './init.js';

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

  /**
   * Resize the terminal to fit the UI.
   * @throws Error if the terminal cannot be resized.
   */
  resizeTerminal: () => Promise<void>;

  /**
   * Clear the terminal screen.
   */
  clearScreen: () => void;
}

export const cli: CLI = {
  getDebuggeeArgs,
  init,
  resizeTerminal,
  clearScreen,
};
