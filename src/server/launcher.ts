import { ChildProcess, exec } from 'child_process';

/**
 * Launch a debuggee process.
 * The debugger has to be in a folder at the root of the Turing Machine project.
 * @param tmPath The absolute path to the Turing machine folder.
 * @param debuggee The file name of the Turing machine and its arguments.
 * @returns A ChildProcess representing the spawned debuggee process.
 */
export function launchDebuggee(tmPath: string, debuggee: string): ChildProcess {
  return exec(`cd ${tmPath} && dune exec ${debuggee}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing binary: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }

    console.log(`Output:\n${stdout}`);
  });
}
