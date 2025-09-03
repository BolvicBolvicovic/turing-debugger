import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import type { ChildProcess } from 'child_process';
import type { TuringMachine } from '../utils/types/parser.types.js';

interface DebuggerAppProps {
  machine: TuringMachine;
  debuggee: ChildProcess;
  onExit?: () => void;
}

export function DebuggerApp({ machine, debuggee, onExit }: DebuggerAppProps): React.JSX.Element {
  const [debuggeeStatus, setDebuggeeStatus] = useState<string>('running');
  const { exit } = useApp();

  useInput((input, key) => {
    if (key.escape || input === 'q') {
      onExit?.();
      exit();
    }
  });

  useEffect(() => {
    const handleExit = (): void => setDebuggeeStatus('exited');
    const handleError = (): void => setDebuggeeStatus('error');

    debuggee.on('exit', handleExit);
    debuggee.on('error', handleError);

    return (): void => {
      debuggee.off('exit', handleExit);
      debuggee.off('error', handleError);
    };
  }, [debuggee]);

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="single" flexDirection="column" paddingX={1}>
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
      </Box>

      <Box marginTop={1} borderStyle="single" flexDirection="column" paddingX={1}>
        <Text bold color="green">
          Debuggee Status
        </Text>
        <Text>PID: {debuggee.pid || 'N/A'}</Text>
        <Text>
          Status:{' '}
          <Text color={debuggeeStatus === 'running' ? 'green' : 'red'}>{debuggeeStatus}</Text>
        </Text>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>Press 'q' or ESC to quit gracefully</Text>
      </Box>
    </Box>
  );
}
