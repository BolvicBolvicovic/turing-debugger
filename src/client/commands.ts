import { BreakpointType } from '../ui/types/breakpoints.type.js';
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
   * @param breakpoint - The breakpoint to add.
   * @returns Promise<void>
   */
  breakpointAdd: (breakpoint: BreakpointType) => Promise<void>;

  /**
   * Removes a breakpoint from the debuggee.
   * @param breakpoint - The breakpoint to remove.
   * @returns Promise<void>
   */
  breakpointRemove: (breakpoint: BreakpointType) => Promise<void>;
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

async function breakpointAdd(breakpoint: BreakpointType): Promise<void> {
  const data = await provider.post('http://localhost:8080/breakpoint', JSON.stringify(breakpoint));
  const parsedRawData = JSON.parse(data);

  if (parsedRawData.error) {
    throw new Error(parsedRawData.error);
  }
}

async function breakpointRemove(breakpoint: BreakpointType): Promise<void> {
  const data = await provider.del('http://localhost:8080/breakpoint', JSON.stringify(breakpoint));
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
