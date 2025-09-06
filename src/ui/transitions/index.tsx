import { Box, Text } from 'ink';
import {
  PANEL_SELECTED_COLOR,
  PANEL_UNSELECTED_COLOR,
  PANEL_BORDER_STYLE,
} from '../constants/main.constants.js';

type TransitionsProps = {
  selected: boolean;
};

export function Transitions({ selected }: TransitionsProps): React.JSX.Element {
  return (
    <Box
      flexDirection="column"
      borderColor={selected ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
      borderStyle={PANEL_BORDER_STYLE}
      height={14}
    >
      <Box marginBottom={1}>
        <Box marginRight={1}>
          <Text color="green">[r]</Text>
        </Box>
        <Text>Transitions Panel</Text>
      </Box>
      <Text>This panel will display the transition functions of the Turing machine.</Text>
      <Text>Feature coming soon!</Text>
    </Box>
  );
}
