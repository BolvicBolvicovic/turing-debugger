import { getTMPath } from './cli/init.js';
import { launchDebuggee, setupDebuggee } from './debuggee/setup.js';
import { cleanupDebuggee } from './debuggee/cleanup.js';
import http from 'http';

try {
  const debuggeeName = getTMPath();
  const debuggee = launchDebuggee(process.env.NODE_TM_PATH!, debuggeeName);
  setupDebuggee(debuggee);

  // Try connecting to the server periodically
  let attempts = 0;
  const maxAttempts = 20;
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`Attempting connection ${attempts}/${maxAttempts}...`);

    const req = http.get('http://localhost:8080/input', res => {
      console.log(`Response ${res.statusCode}:`);

      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        console.log('Response data:', data);
        cleanupDebuggee(debuggee);
      });
    });

    req.on('error', () => {
      if (attempts >= maxAttempts) {
        console.log('Max attempts reached, stopping...');
        cleanupDebuggee(debuggee);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    req.destroy();
  }
} catch (error) {
  console.error('Error launching debuggee:', error);
}
