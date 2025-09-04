import { useEffect, useState } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import type { Step, TuringMachine } from '../utils/types/parser.types.js';
import { Tape } from './tape/index.js';
import { DebuggeeArgs } from '../cli/cli.types.js';
import { commands } from '../client/commands.js';

interface RootProps {
  machine: TuringMachine;
  debuggeeArgs: DebuggeeArgs;
  onExit?: () => void;
}

export function Root({ machine, debuggeeArgs, onExit }: RootProps): React.JSX.Element {
  const { exit } = useApp();

  const [currentState, setCurrentState] = useState<Step>({
    input: debuggeeArgs.machineInput,
    state: machine.initial,
    head: 0,
  });

  useInput(async (input, key) => {
    if (key.escape || input === 'q') {
      onExit?.();
      exit();
    }

    if (input === 's') {
      if (machine.finals.includes(currentState.state)) {
        onExit?.();
        exit();
      }
      const nextStep = await commands.nextStep();
      setCurrentState(nextStep);
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box margin={1} borderStyle="single" flexDirection="column">
        <Text bold color="blue">
          Turing Machine Debugger
        </Text>
        <Text>Machine: {machine.name}</Text>
        <Text>
          States: {machine.states.length} | Alphabet: {machine.alphabet.join(', ')}
        </Text>
        <Text>
          Initial: {machine.initial} | Finals: {machine.finals.join(', ')}
        </Text>
        <Text>Current State: {currentState.state}</Text>
      </Box>

      <Tape input={currentState.input} headPosition={currentState.head} blank={machine.blank} />

      <Box marginTop={1}>
        <Text dimColor>Press 's' for next step</Text>
        <Text dimColor>Press 'q' or ESC to quit gracefully</Text>
      </Box>
    </Box>
  );
}
