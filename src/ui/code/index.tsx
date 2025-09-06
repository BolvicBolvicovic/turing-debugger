import { Box, Text } from 'ink';
import {
  PANEL_BORDER_STYLE,
  PANEL_HEIGHT,
  PANEL_SELECTED_COLOR,
  PANEL_UNSELECTED_COLOR,
} from '../constants/main.constants.js';

type CodeProps = {
  selected: boolean;
};

export function Code({ selected }: CodeProps): React.JSX.Element {
  return (
    <Box
      flexDirection="column"
      borderColor={selected ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
      borderStyle={PANEL_BORDER_STYLE}
      height={PANEL_HEIGHT - 10}
    >
      <Box marginBottom={1}>
        <Box marginRight={1}>
          <Text color="green">[c]</Text>
        </Box>
        <Text>Code Panel</Text>
      </Box>
      <Text>This panel will display the generated code for the Turing machine.</Text>
      <Text>Feature coming soon!</Text>
    </Box>
  );
}
