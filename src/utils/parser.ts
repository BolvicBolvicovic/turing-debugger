import { readFileSync } from 'fs';
import { homedir } from 'os';
import { resolve } from 'path';
import { Parser, TuringMachine, TuringMachineSchema } from './types/parser.types.js';

function expandPath(filePath: string): string {
  if (filePath.startsWith('~/')) {
    return resolve(homedir(), filePath.slice(2));
  }
  return resolve(filePath);
}

export function turingMachine(path: string): Promise<TuringMachine> {
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

      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
}

export const parser: Parser = {
  turingMachine,
};
