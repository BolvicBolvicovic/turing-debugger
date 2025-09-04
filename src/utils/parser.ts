import { readFileSync } from 'fs';
import { homedir } from 'os';
import { resolve } from 'path';
import {
  Parser,
  Step,
  StepSchema,
  TuringMachine,
  TuringMachineSchema,
} from './types/parser.types.js';
import { lib } from './lib.js';

let cachedBlank: string | null = null;

function expandPath(filePath: string): string {
  if (filePath.startsWith('~/')) {
    return resolve(homedir(), filePath.slice(2));
  }
  return resolve(filePath);
}

function turingMachine(path: string): Promise<TuringMachine> {
  return new Promise((resolve, reject) => {
    try {
      const expandedPath = expandPath(path);
      const fileContent = readFileSync(expandedPath, 'utf-8');
      const parsedData = JSON.parse(fileContent);
      const result = TuringMachineSchema.safeParse(parsedData);

      if (!result.success) {
        reject(new Error(`Invalid Turing Machine structure: ${result.error.message}`));
        return;
      }

      cachedBlank = result.data.blank;

      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
}

function step(rawStep: object): Promise<Step> {
  return new Promise((resolve, reject) => {
    try {
      if (cachedBlank === null) {
        throw new Error('Turing Machine must be parsed before parsing steps.');
      }

      const result = StepSchema.safeParse(rawStep);

      if (!result.success) {
        throw new Error(`Invalid Step structure: ${result.error.message}`);
      }

      resolve({ ...result.data, input: lib.trimChar(result.data.input, cachedBlank) });
    } catch (error) {
      reject(error);
    }
  });
}

export const parser: Parser = {
  turingMachine,
  step,
};
