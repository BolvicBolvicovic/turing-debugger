import { ChildProcess, execSync } from 'child_process';

export async function cleanupDebuggee(debuggee: ChildProcess): Promise<void> {
  console.log('Starting cleanup...');

  // Kill the debuggee process first
  if (!debuggee.killed && debuggee.pid) {
    console.log(`Killing debuggee process (PID: ${debuggee.pid})...`);
    try {
      debuggee.kill('SIGTERM');
      // Give it a moment to exit gracefully
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!debuggee.killed) {
        console.log('Force killing debuggee...');
        debuggee.kill('SIGKILL');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error killing debuggee:', error);
    }
  }

  // Clean up any remaining processes on port 8080, but exclude our own process
  try {
    console.log('Cleaning up remaining processes on port 8080...');
    execSync(`kill $(lsof -ti:8080 | grep -v ${process.pid})`, { stdio: 'ignore' });
    console.log('Port cleanup completed');
  } catch {
    console.log('No additional processes found on port 8080');
  }

  console.log('Cleanup completed');
  process.exit(0);
}
