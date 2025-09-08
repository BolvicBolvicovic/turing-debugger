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
import { LEFT_PANEL_WIDTH } from '../ui/constants/main.constants.js';

const TAPE_WIDTH = LEFT_PANEL_WIDTH - 10;

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

function formatTape(input: string, headPosition: number, viewIndex: number): string {
  const tapeWithoutHead = input.slice(0, viewIndex) + '<' + input.slice(viewIndex);
  const tapeWithHead =
    viewIndex > headPosition + 1
      ? tapeWithoutHead.slice(0, headPosition) +
        '[' +
        tapeWithoutHead.charAt(headPosition) +
        ']' +
        tapeWithoutHead.slice(headPosition + 1)
      : viewIndex === headPosition + 1
        ? tapeWithoutHead.slice(0, headPosition) +
          '[' +
          tapeWithoutHead.slice(headPosition, headPosition + 2) +
          ']' +
          tapeWithoutHead.slice(headPosition + 2)
        : tapeWithoutHead.slice(0, headPosition + 1) +
          '[' +
          tapeWithoutHead.charAt(headPosition + 1) +
          ']' +
          tapeWithoutHead.slice(headPosition + 2);

  const newViewIndex =
    viewIndex > headPosition + 1
      ? viewIndex + 2
      : viewIndex === headPosition + 1
        ? viewIndex + 1
        : viewIndex;

  if (tapeWithHead.length <= TAPE_WIDTH) {
    return tapeWithHead;
  }

  const visibleTape =
    newViewIndex <= TAPE_WIDTH / 2
      ? tapeWithHead.slice(0, TAPE_WIDTH - 3) + '...'
      : tapeWithHead.length - newViewIndex <= TAPE_WIDTH / 2
        ? '...' + tapeWithHead.slice(-TAPE_WIDTH + 3)
        : '...' +
          tapeWithHead.slice(
            newViewIndex - (TAPE_WIDTH / 2 - 3),
            newViewIndex + (TAPE_WIDTH / 2 - 3)
          ) +
          '...';

  return visibleTape;
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
  formatTape,
  mapTransitionsToContent,
};
