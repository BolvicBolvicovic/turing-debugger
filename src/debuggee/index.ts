import { cleanupDebuggee } from './cleanup.js';
import { launchDebuggee, setupDebuggee } from './setup.js';

interface Debuggee {
  /**
   * Launch a debuggee process.
   * The debugger has to be in a folder at the root of the Turing Machine project.
   * @param tmPath The absolute path to the Turing machine folder.
   * @param debuggee The file name of the Turing machine and its arguments.
   * @returns A ChildProcess representing the spawned debuggee process.
   */
  launch: typeof launchDebuggee;
  /**
   * Set up the debuggee process.
   * @param debuggee The ChildProcess representing the debuggee.
   */
  setup: typeof setupDebuggee;
  /**
   * Clean up the debuggee process.
   * @param debuggee The ChildProcess representing the debuggee.
   */
  cleanup: typeof cleanupDebuggee;
}

export const debuggee: Debuggee = {
  launch: launchDebuggee,
  setup: setupDebuggee,
  cleanup: cleanupDebuggee,
};
