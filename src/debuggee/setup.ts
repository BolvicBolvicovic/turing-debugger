import { ChildProcess, exec } from 'child_process';
import { cleanupDebuggee } from './cleanup.js';

/**
 * Launch a debuggee process.
 * The debugger has to be in a folder at the root of the Turing Machine project.
 * @param tmPath The absolute path to the Turing machine folder.
 * @param debuggee The file name of the Turing machine and its arguments.
 * @returns A ChildProcess representing the spawned debuggee process.
 */
export function launchDebuggee(tmPath: string, debuggee: string): ChildProcess {
  const command = `cd ${tmPath} && dune exec ft_turing -- --debug ${debuggee}`;

  return exec(command, (error, stdout, stderr) => {
    if (error) {
      throw error;
    }

    if (stderr) {
      throw new Error(stderr);
    }

    if (stdout.includes('USAGE:')) {
      throw new Error(`Debuggee usage error!\nCommand used:\n${command}\nDebuggee:\n${debuggee}`);
    }

    console.log(`Output:\n${stdout}`);
  });
}

export function setupDebuggee(debuggee: ChildProcess): void {
  // Monitor debuggee output
  debuggee.stdout?.on('data', data => console.log('STDOUT:', data.toString()));
  debuggee.stderr?.on('data', data => console.log('STDERR:', data.toString()));

  debuggee.on('error', error => console.error('Debuggee error:', error));
  process.on('SIGINT', () => cleanupDebuggee(debuggee));
}
