import { parser } from '../utils/parser.js';
import { provider } from '../utils/provider.js';
import { Step } from '../utils/types/parser.types.js';

interface Commands {
  /**
   * Gets the next step from the debuggee.
   * The current state of the debuggee is currently stored in the Turing Machine.
   * @returns Promise<Step>
   */
  nextStep: () => Promise<Step>;
}

async function nextStep(): Promise<Step> {
  const data = await provider.get('http://localhost:8080/next-step');
  const parsedRawData = JSON.parse(data);
  const parsedData = await parser.step(parsedRawData);

  return parsedData;
}

export const commands: Commands = {
  nextStep,
};
