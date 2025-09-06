import { Box, Text } from 'ink';
import {
  PANEL_SELECTED_COLOR,
  PANEL_UNSELECTED_COLOR,
  PANEL_BORDER_STYLE,
} from '../constants/main.constants.js';

type BreakpointsProps = {
  selected: boolean;
};

export function Breakpoints({ selected }: BreakpointsProps): React.JSX.Element {
  return (
    <Box
      flexDirection="column"
      borderColor={selected ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
      borderStyle={PANEL_BORDER_STYLE}
      height={12}
    >
      <Box marginBottom={1}>
        <Box marginRight={1}>
          <Text color="green">[b]</Text>
        </Box>
        <Text>Breakpoints Panel</Text>
      </Box>
      <Text>This panel will display and manage breakpoints for the Turing machine.</Text>
      <Text>Feature coming soon!</Text>
    </Box>
  );
}
