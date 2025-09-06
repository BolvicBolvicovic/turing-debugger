import { Box, Newline, Text } from 'ink';
import {
  PANEL_BORDER_STYLE,
  PANEL_SELECTED_COLOR,
  PANEL_UNSELECTED_COLOR,
} from '../constants/main.constants.js';
import { parser } from '../../utils/parser.js';

type TapeProps = {
  input: string;
  headPosition: number;
  viewIndex: number;
  selected: boolean;
};

export function Tape({ input, headPosition, viewIndex, selected }: TapeProps): React.ReactNode {
  return (
    <Box
      borderStyle={PANEL_BORDER_STYLE}
      borderColor={selected ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
      flexDirection="column"
    >
      <Text bold>Tape: {parser.formatTape(input, headPosition, viewIndex)}</Text>
      <Newline />
      <Text bold>Head Pos: {headPosition}</Text>
    </Box>
  );
}
