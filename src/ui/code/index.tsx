import { Box, Text } from 'ink';
import {
  PANEL_BORDER_STYLE,
  PANEL_SELECTED_COLOR,
  PANEL_UNSELECTED_COLOR,
} from '../constants/main.constants.js';

type CodeProps = {
  selected: boolean;
  assemblyFile?: string;
};

export function Code({ selected, assemblyFile }: CodeProps): React.JSX.Element {
  return (
    <Box
      flexDirection="column"
      borderColor={selected ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
      borderStyle={PANEL_BORDER_STYLE}
      height={12}
    >
      <Box marginBottom={1} justifyContent="space-between">
        <Box flexDirection="row">
          <Box marginRight={1}>
            <Text color="green">[c]</Text>
          </Box>
          <Text>Code Panel</Text>
        </Box>
        {assemblyFile && (
          <Box>
            <Text>Assembly File: {assemblyFile}</Text>
          </Box>
        )}
      </Box>
      <Text>This panel will display the generated code for the Turing machine.</Text>
      <Text>Feature coming soon!</Text>
    </Box>
  );
}
