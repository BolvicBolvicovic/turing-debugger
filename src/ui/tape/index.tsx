import { Box, Text } from 'ink';

function formatInput(input: string, headPosition: number, blank: string): string {
  const WINDOW_SIZE = 10;
  const TOTAL_WIDTH = 20;

  // Step 1: Create tape with head marker
  const left = input.slice(0, headPosition);
  const head = input.charAt(headPosition) || blank;
  const right = input.slice(headPosition + 1);
  const tapeWithHead = `${left}[${head}]${right}`;

  // Step 2: Extract visible window around head position
  const startPos = Math.max(0, headPosition - WINDOW_SIZE);
  const endPos = Math.min(tapeWithHead.length, headPosition + WINDOW_SIZE + 3);
  let visibleTape = tapeWithHead.slice(startPos, endPos);

  // Step 3: Add leading ellipsis if content was truncated
  if (startPos > 0) {
    visibleTape = '...' + visibleTape.slice(3);
  }

  // Step 4: Adjust to final width
  if (visibleTape.length < TOTAL_WIDTH) {
    return visibleTape.padEnd(TOTAL_WIDTH, blank);
  }

  if (visibleTape.length > TOTAL_WIDTH) {
    return visibleTape.slice(0, TOTAL_WIDTH - 3) + '...';
  }

  return visibleTape;
}

type TapeProps = {
  input: string;
  headPosition: number;
  blank: string;
};

export function Tape({ input, headPosition, blank }: TapeProps): React.ReactNode {
  return (
    <Box margin={1} borderStyle="single" flexDirection="column">
      <Text bold>Tape Component</Text>
      <Text>
        Raw input: {input}, Head Position: {headPosition}
      </Text>
      <Text>Input: {formatInput(input, headPosition, blank)}</Text>
    </Box>
  );
}
