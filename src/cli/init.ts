import { Command, program } from 'commander';
import { DebuggeeArgs } from './cli.types.js';

export function getDebuggeeArgs(): DebuggeeArgs {
  const machinePath = process.env.NODE_TM_PATH! + '/' + program.args[0].trim().split('/').join('/');
  const machineInput = program.args[1];
  const asString = machinePath + ' ' + machineInput;

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
