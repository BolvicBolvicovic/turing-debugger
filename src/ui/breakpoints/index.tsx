import { Box, Text, useInput } from 'ink';
import {
  PANEL_SELECTED_COLOR,
  PANEL_UNSELECTED_COLOR,
  PANEL_BORDER_STYLE,
} from '../constants/main.constants.js';
import { Input } from '../components/input.js';
import { useEffect, useState } from 'react';
import { CurrentInput } from '../types/breakpoints.type.js';
import { commands } from '../../client/commands.js';

const BP_INPUT_WIDTH = 15;

// TODO: find a better name for setBreakpoint
async function setBreakpoint(
  stateName: string,
  readSymbol: string,
  sending: boolean,
  states: string[],
  alphabet: string[]
): Promise<{ sent: boolean; message: string }> {
  if (stateName === '') {
    return { sent: false, message: 'State name cannot be empty.' };
  }
  if (!states.includes(stateName)) {
    return { sent: false, message: `State "${stateName}" does not exist.` };
  }

  if (readSymbol === '') {
    return { sent: false, message: 'Read symbol cannot be empty.' };
  }

  if (!alphabet.includes(readSymbol)) {
    return { sent: false, message: `Symbol "${readSymbol}" is not in the alphabet.` };
  }

  if (sending) {
    try {
      await commands.breakpointAdd(stateName, readSymbol);
      return {
        sent: true,
        message: `Breakpoint set at state "${stateName}" when reading symbol "${readSymbol}"`,
      };
    } catch (error) {
      if (error instanceof Error) {
        return { sent: false, message: `Error: ${error.message}` };
      }
      return { sent: false, message: 'An unknown error occurred.' };
    }
  }

  return {
    sent: false,
    message: `Set breakpoint at state "${stateName}" when reading symbol "${readSymbol}"`,
  };
}

type BreakpointsProps = {
  selected: boolean;
  writing: boolean;
  setWriting: (writing: boolean) => void;
  states: string[];
  alphabet: string[];
};

export function Breakpoints({
  selected,
  writing,
  setWriting,
  states,
  alphabet,
}: BreakpointsProps): React.JSX.Element {
  const [currentInput, setCurrentInput] = useState<CurrentInput>(CurrentInput.STATE_NAME);
  const [stateName, setStateName] = useState<string>('');
  const [readSymbol, setReadSymbol] = useState<string>('');

  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (selected) {
      setCurrentInput(CurrentInput.STATE_NAME);
      setStateName('');
      setReadSymbol('');
    }
  }, [selected]);

  useInput(async (inpt, key) => {
    if (!selected) return;

    if (key.return) {
      const { sent, message } = await setBreakpoint(stateName, readSymbol, true, states, alphabet);
      setMessage(message);
      if (!sent) return;

      setStateName('');
      setReadSymbol('');
      setCurrentInput(CurrentInput.STATE_NAME);
      setWriting(false);
      return;
    }

    if (writing) {
      if (key.tab) {
        setCurrentInput(prev =>
          prev === CurrentInput.STATE_NAME ? CurrentInput.READ_SYMBOL : CurrentInput.STATE_NAME
        );

        const { message } = await setBreakpoint(stateName, readSymbol, false, states, alphabet);
        setMessage(message);
        return;
      }

      if (key.escape) {
        setWriting(false);

        const { message } = await setBreakpoint(stateName, readSymbol, false, states, alphabet);
        setMessage(message);
        return;
      }
    } else if (inpt === 'w') {
      setWriting(true);
    }
  });

  return (
    <Box
      flexDirection="column"
      borderColor={selected ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
      borderStyle={PANEL_BORDER_STYLE}
      height={14}
    >
      <Box marginBottom={1} flexDirection="row" alignItems="center">
        <Box marginRight={1}>
          <Text color="green">[b]</Text>
        </Box>
        <Input
          borderStyle="round"
          width={BP_INPUT_WIDTH * 2}
          selected={selected && currentInput === CurrentInput.STATE_NAME}
          generalWriting={writing}
          input={stateName}
          setInput={setStateName}
          placeholder="State name"
        />
        <Input
          borderStyle="round"
          width={BP_INPUT_WIDTH}
          selected={selected && currentInput === CurrentInput.READ_SYMBOL}
          generalWriting={writing}
          input={readSymbol}
          setInput={setReadSymbol}
          placeholder="Read symbol"
          maxLength={1}
        />
      </Box>
      <Text>{message}</Text>
      <Text>Feature coming soon!</Text>
    </Box>
  );
}
