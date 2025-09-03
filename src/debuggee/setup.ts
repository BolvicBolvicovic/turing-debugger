import { ChildProcess, exec } from 'child_process';
import { cleanupDebuggee } from './cleanup.js';

export async function launchDebuggee(tmPath: string, debuggee: string): Promise<ChildProcess> {
  const command = `cd ${tmPath} && dune exec ft_turing -- --debug ${debuggee}`;

  const debuggeeProcess = exec(command);

  let data = '';

  debuggeeProcess.stdout?.on('data', chunk => {
    data += chunk.toString();
  });

  debuggeeProcess.stderr?.on('data', chunk => {
    data += chunk.toString();
  });

  while (!data.includes('Running at http://localhost:8080')) {
    await new Promise(resolve => setTimeout(resolve, 100));
    continue;
  }

  return debuggeeProcess;
}

export function setupDebuggee(debuggee: ChildProcess): void {
  // Monitor debuggee output
  debuggee.stdout?.on('data', data => console.log('STDOUT:', data.toString()));
  debuggee.stderr?.on('data', data => console.log('STDERR:', data.toString()));

  debuggee.on('error', error => console.error('Debuggee error:', error));
  process.on('SIGINT', () => cleanupDebuggee(debuggee));
}
