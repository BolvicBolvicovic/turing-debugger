import { Command, program } from 'commander';
import { DebuggeeArgs } from './cli.types.js';
import * as path from 'path';
import * as os from 'os';

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
