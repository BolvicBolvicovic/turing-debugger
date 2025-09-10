import { readFileSync } from 'fs';
import { homedir } from 'os';
import { resolve } from 'path';
import {
  Line,
  Parser,
  Step,
  StepSchema,
  Transitions,
  TuringMachine,
  TuringMachineSchema,
} from './types/parser.types.js';

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

      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
}

function step(rawStep: object): Promise<Step> {
  return new Promise((resolve, reject) => {
    try {
      const result = StepSchema.safeParse(rawStep);

      if (!result.success) {
        throw new Error(`Invalid Step structure: ${result.error.message}`);
      }

      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
}

function mapTransitionsToContent(transitions: Transitions, transitionsKeys: string[]): Line[] {
  const content: Line[] = [];
  let globalIndex = 0;

  for (const key of transitionsKeys) {
    const isFinalState = !transitions[key];
    const stateLine: Line = {
      text: key,
      index: globalIndex++,
      type: 'state',
      parent: undefined,
    };
    content.push(stateLine);

    if (!isFinalState) {
      const rules = transitions[key] || [];
      for (const rule of rules) {
        const transitionLine: Line = {
          text: `read: ${rule.read}, write: ${rule.write}, action: ${rule.action}, to_state: ${rule.to_state}`,
          index: globalIndex++,
          type: 'transition',
          parent: key,
        };
        content.push(transitionLine);
      }
    }
  }

  return content;
}

export const parser: Parser = {
  turingMachine,
  step,
  mapTransitionsToContent,
};
