import { Box, Newline, Text, useInput } from 'ink';
import {
  PANEL_BORDER_STYLE,
  PANEL_SELECTED_COLOR,
  PANEL_UNSELECTED_COLOR,
  TAPE_WIDTH,
} from '../constants/main.constants.js';
import { useEffect, useState } from 'react';

type TapeProps = {
  input: string;
  headPosition: number;
  selected: boolean;
};

function formatTape(input: string, headPosition: number, offset: number): string {
  const tapeWithHead =
    input.slice(0, headPosition) + '[' + input[headPosition] + ']' + input.slice(headPosition + 1);
  return tapeWithHead.slice(offset);
}

export function Tape({ input, headPosition, selected }: TapeProps): React.ReactNode {
  const [offset, setOffset] = useState(0);

  function findHead(): number {
    return headPosition < TAPE_WIDTH
      ? 0
      : headPosition < input.length - TAPE_WIDTH
        ? headPosition - Math.floor(TAPE_WIDTH / 2)
        : input.length - TAPE_WIDTH;
  }

  useEffect(() => {
    setOffset(findHead());
  }, [headPosition]);

  useInput((inputKey, key) => {
    if (!selected) {
      return;
    }

    if (inputKey === 'o') {
      setOffset(0);
    }

    if (inputKey === 'e') {
      setOffset(Math.max(input.length - TAPE_WIDTH, 0));
    }

    if (inputKey === 'f') {
      setOffset(findHead());
    }

    if (key.leftArrow) {
      setOffset(prev => Math.max(prev - 1, 0));
    }

    if (key.rightArrow) {
      setOffset(prev => Math.min(prev + 1, input.length - TAPE_WIDTH));
    }
  });

  return (
    <Box
      borderStyle={PANEL_BORDER_STYLE}
      borderColor={selected ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
      flexDirection="column"
    >
      <Box marginBottom={1}>
        <Box marginRight={1}>
          <Text color="green">[t]</Text>
        </Box>
        <Text>Tape</Text>
      </Box>
      <Newline />
      <Text wrap="truncate">{formatTape(input, headPosition, offset)}</Text>
      <Text bold>Head Pos: {headPosition}</Text>
    </Box>
  );
}
