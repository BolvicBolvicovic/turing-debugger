import { launchDebuggee } from './server/launcher.js';

const debuggeeName = process.argv.filter((_, i) => i > 3).join(' ');

try {
  launchDebuggee(process.env.NODE_TM_PATH!, debuggeeName);
} catch (error) {
  console.error('Error launching debuggee:', error);
}
