import { Box, Text, useInput } from 'ink';
import {
  PANEL_UNSELECTED_COLOR,
  PANEL_BORDER_STYLE,
  PANEL_SELECTED_COLOR,
  INPUT_WIDTH,
} from '../constants/main.constants.js';
import { useEffect, useState } from 'react';
import { man } from '../../man/index.js';

type HelperProps = {
  selected: boolean;
  writing: boolean;
  setWriting: (writing: boolean) => void;
};

export function Helper({ selected, writing, setWriting }: HelperProps): React.JSX.Element {
  const [input, setInput] = useState<string>('');
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

  useEffect(() => {
    if (!selected) {
      setWriting(false);
      setInput('');
    }
  }, [selected]);

  useInput((inpt, key) => {
    if (selected) {
      if (!writing) {
        if (inpt === 'w') {
          setWriting(true);
        }
      } else {
        if (key.return) {
          setWriting(false);
          setInput('');
        }

        if (key.backspace || key.delete) {
          setInput(prev => prev.slice(0, -1));
        } else if (
          inpt &&
          !key.escape &&
          !key.ctrl &&
          !key.meta &&
          !key.shift &&
          input.length < INPUT_WIDTH - 5
        ) {
          setInput(prev => prev + inpt);
        }
      }
    }
  });

  return (
    <Box
      flexDirection="column"
      borderStyle={PANEL_BORDER_STYLE}
      borderColor={selected ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
      justifyContent="space-between"
      height={10}
    >
      <Box flexDirection="column" marginRight={2}>
        <Box marginBottom={1} borderStyle="round" width={INPUT_WIDTH}>
          <Text key="helper-writing-indicator">{writing ? '> ' : ''}</Text>
          <Text
            color={writing ? 'white' : 'gray'}
            italic={!writing}
            dimColor={!writing}
            wrap="truncate-start"
            key="helper-input"
          >
            {writing
              ? input
              : selected
                ? "Press 'w' to start writing..."
                : "Press 'h' for help panel..."}
            {writing && blinking && <Text>|</Text>}
          </Text>
        </Box>
        {writing && man.search(input).map(line => <Text key={line}>{line}</Text>)}
      </Box>
    </Box>
  );
}
