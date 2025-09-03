import { provider } from '../utils/provider.js';

interface Commands {
  /**
   * Gets the next step from the debuggee.
   * The current state of the debuggee is currently stored in the Turing Machine.
   * @returns Promise<string> containing stringify JSON response: { input, state, head }
   */
  nextStep: () => Promise<string>;
}

async function nextStep(): Promise<string> {
  const data = await provider.get('http://localhost:8080/next-step');
  console.log(`Response: ${data}`);
  return data;
}

export const commands: Commands = {
  nextStep,
};
