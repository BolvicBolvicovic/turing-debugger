import { Box, Text } from 'ink';
import { PANEL_UNSELECTED_COLOR, PANEL_BORDER_STYLE } from '../constants/main.constants.js';

export function Helper(): React.JSX.Element {
  return (
    <Box
      flexDirection="row"
      borderStyle={PANEL_BORDER_STYLE}
      borderColor={PANEL_UNSELECTED_COLOR}
      justifyContent="space-between"
    >
      <Box flexDirection="column" marginLeft={2}>
        <Text bold>Helper for main commands:</Text>
        <Text>'s' for Step</Text>
        <Text>'q' or ESC to Quit</Text>
      </Box>
      <Box flexDirection="column" marginRight={2}>
        <Text>'t' for Tape panel</Text>
        <Text>'r' for Transitions panel</Text>
        <Text>'c' for Code panel</Text>
        <Text>'b' for Breakpoints panel</Text>
      </Box>
    </Box>
  );
}
