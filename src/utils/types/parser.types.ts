import { z } from 'zod';

export interface Parser {
  /**
   * Parses a Turing Machine from a JSON file with zod schema validation.
   * @param path - The absolute file path to the JSON file.
   * @returns The parsed Turing Machine in a Promise.
   * @throws Error if the JSON is invalid or the structure is incorrect.
   */
  turingMachine: (path: string) => Promise<TuringMachine>;

  /**
   * Parses a Step object with zod schema validation.
   * A Step is the object received from the debuggee process when stepping forward.
   * @param rawStep
   * @returns The parsed Step in a Promise.
   * @throws Error if the structure is incorrect.
   */
  step: (rawStep: object) => Promise<Step>;

  /**
   * Maps the transitions to lines for display in the UI.
   * @param transitions - The transitions object from the Turing Machine.
   * @param transitionsKeys - The keys of the transitions object (state names).
   * @returns An array of Line objects representing the transitions content.
   */
  mapTransitionsToContent: (
    transitions: Record<
      string,
      { read: string; write: string; action: 'RIGHT' | 'LEFT'; to_state: string }[]
    >,
    transitionsKeys: string[]
  ) => Line[];
}

const TransitionRuleSchema = z.object({
  read: z.string(),
  write: z.string(),
  action: z.enum(['RIGHT', 'LEFT']),
  to_state: z.string(),
});

const TransitionsSchema = z.record(z.string(), z.array(TransitionRuleSchema));
export type Transitions = z.infer<typeof TransitionsSchema>;

export const TuringMachineSchema = z.object({
  name: z.string(),
  alphabet: z.array(z.string()),
  blank: z.string(),
  states: z.array(z.string()),
  initial: z.string(),
  finals: z.array(z.string()),
  transitions: TransitionsSchema,
});
export type TuringMachine = z.infer<typeof TuringMachineSchema>;

export const StepSchema = z.object({
  input: z.string(),
  state: z.string(),
  head: z.number().nonnegative().int(),
});
export type Step = z.infer<typeof StepSchema>;

export type Line = {
  text: string;
  index: number;
  type: 'state' | 'transition';
  parent?: string;
};
