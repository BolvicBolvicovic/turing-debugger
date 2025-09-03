import { z } from 'zod';

interface Parser {
  /**
   * Parses a Turing Machine from a JSON file with zod schema validation.
   * @param path - The absolute file path to the JSON file.
   * @returns The parsed Turing Machine in a Promise.
   * @throws Error if the JSON is invalid or the structure is incorrect.
   */
  turingMachine: (path: string) => Promise<TuringMachine>;
}

const TransitionRuleSchema = z.object({
  read: z.string(),
  write: z.string(),
  action: z.enum(['RIGHT', 'LEFT']),
  to_state: z.string(),
});

const TransitionSchema = z.record(z.string(), z.array(TransitionRuleSchema));

const TuringMachineSchema = z.object({
  name: z.string(),
  alphabet: z.array(z.string()),
  blank: z.string(),
  states: z.array(z.string()),
  initial: z.string(),
  finals: z.array(z.string()),
  transitions: TransitionSchema,
});

export type TuringMachine = z.infer<typeof TuringMachineSchema>;
export type Transition = z.infer<typeof TransitionSchema>;
export { Parser, TuringMachineSchema };
