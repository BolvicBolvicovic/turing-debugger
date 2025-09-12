import { Box, Text, useInput } from 'ink';
import { ComponentProps, JSX, useEffect, useState } from 'react';
import { INPUT_WIDTH } from '../constants/main.constants.js';

const START_WRITING_ACTION = "Press 'w' to write...";

type InputProps = {
  selected: boolean;
  generalWriting: boolean;
  input: string;
  setInput: (input: string) => void;
  placeholder?: string;
  maxLength?: number;
} & ComponentProps<typeof Box>;

export function Input({
  selected,
  generalWriting,
  input,
  setInput,
  placeholder = '',
  width = INPUT_WIDTH,
  maxLength = INPUT_WIDTH,
  ...props
}: InputProps): JSX.Element {
  const writing = generalWriting && selected;

  const [blinking, setBlinking] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (writing) {
      interval = setInterval(() => {
        setBlinking(prev => !prev);
      }, 600);
    } else {
      setBlinking(false);
      if (interval) clearInterval(interval);
    }
    return (): void => {
      if (interval) clearInterval(interval);
    };
  }, [writing, blinking]);

  useInput((inpt, key) => {
    if (writing) {
      if (key.backspace || key.delete) {
        setInput(input.slice(0, -1));
      } else if (
        inpt &&
        !key.escape &&
        !key.return &&
        !key.ctrl &&
        !key.meta &&
        input.length < maxLength
      ) {
        setInput(input + inpt);
      }
    }
  });

  return (
    <Box {...props} width={width}>
      <Text key="helper-writing-indicator">{writing ? '> ' : ''}</Text>
      <Text
        color={writing ? 'white' : 'gray'}
        italic={!writing}
        dimColor={!writing}
        wrap="truncate-start"
        key="helper-input"
      >
        {input.length > 0 || writing ? input : selected ? START_WRITING_ACTION : placeholder}
        {writing && <Text>{blinking ? '|' : ' '}</Text>}
      </Text>
    </Box>
  );
}
