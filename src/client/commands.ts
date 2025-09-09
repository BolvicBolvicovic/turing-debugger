import { parser } from '../utils/parser.js';
import { provider } from '../utils/provider.js';
import { Step } from '../utils/types/parser.types.js';

interface Commands {
  /**
   * Gets the next step from the debuggee.
   * The current state of the debuggee is currently stored in the Turing Machine.
   * @returns Promise<Step>
   */
  step: () => Promise<Step>;

  /**
   * Runs the debuggee until it hits a breakpoint or halts.
   * The current state of the debuggee is currently stored in the Turing Machine.
   * @returns Promise<Step>
   */
  run: () => Promise<Step>;

  /**
   * Adds a breakpoint to the debuggee.
   * @param state - The current state of the debuggee.
   * @param read - The value to read from the debuggee.
   * @returns Promise<void>
   */
  breakpointAdd: (state: string, read: string) => Promise<void>;

  /**
   * Removes a breakpoint from the debuggee.
   * @param params - An object containing the state and read value of the breakpoint to remove.
   * @returns Promise<void>
   */
  breakpointRemove: (params: { state: string; read: string }) => Promise<void>;
}

async function step(): Promise<Step> {
  const data = await provider.get('http://localhost:8080/step');
  const parsedRawData = JSON.parse(data);
  return parser.step(parsedRawData);
}

async function run(): Promise<Step> {
  const data = await provider.get('http://localhost:8080/run');
  const parsedRawData = JSON.parse(data);
  return parser.step(parsedRawData);
}

async function breakpointAdd(state: string, read: string): Promise<void> {
  const data = await provider.post(
    'http://localhost:8080/breakpoint',
    JSON.stringify({
      state,
      read,
    })
  );
  const parsedRawData = JSON.parse(data);

  if (parsedRawData.error) {
    throw new Error(parsedRawData.error);
  }
}

async function breakpointRemove(params: { state: string; read: string }): Promise<void> {
  const data = await provider.del('http://localhost:8080/breakpoint', JSON.stringify(params));
  const parsedRawData = JSON.parse(data);

  if (parsedRawData.error) {
    throw new Error(parsedRawData.error);
  }
}

export const commands: Commands = {
  step,
  run,
  breakpointAdd,
  breakpointRemove,
};
