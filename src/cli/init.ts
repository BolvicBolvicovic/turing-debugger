import { Command, program } from 'commander';
import { DebuggeeArgs } from './cli.types.js';
import { exec } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import { TERMINAL_HEIGHT, TERMINAL_WIDTH } from '../ui/constants/main.constants.js';

function expandPath(filePath: string): string {
  if (filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

export function getDebuggeeArgs(): DebuggeeArgs {
  const machinePath =
    expandPath(process.env.NODE_TM_PATH!) + '/' + program.args[0].trim().split('/').join('/');
  const machineInput = program.args[1];

  const quotes = machineInput.match(/^".*"$/) ? (machineInput.match(/^'.*'$/) ? '' : "'") : '"';

  const asString = `${quotes}${machinePath}${quotes} ${quotes}${machineInput}${quotes}`;

  return {
    machinePath,
    machineInput,
    asString,
  };
}

export function init(): Command {
  program
    .name('turing-debugger')
    .description('A Turing machine debugger for the command line.')
    .version('1.0.0')
    .option(
      '-s, --assembly-file <path>',
      'Path to locate the assembly code file related to the Turing machine program.'
    )
    .argument('<machineFile>')
    .argument('<machineInput>')
    .helpOption('-h, --help', 'Display help for command')
    .parse(process.argv);

  return program;
}

export async function resizeTerminal(): Promise<void> {
  const isWindows = process.platform === 'win32';
  const command = isWindows
    ? `mode con: cols=${TERMINAL_WIDTH} lines=${TERMINAL_HEIGHT}`
    : `printf '\\e[8;${TERMINAL_HEIGHT};${TERMINAL_WIDTH}t'`;
  exec(command, (error, _, stderr) => {
    if (error) {
      throw new Error(`Error resizing terminal: ${error.message}`);
    }
    if (stderr) {
      throw new Error(`Error resizing terminal: ${stderr}`);
    }
  });
  await new Promise(resolve => setTimeout(resolve, 100));
}

export function clearScreen(): void {
  process.stdout.write('\x1b[2J\x1b[0f');
}
