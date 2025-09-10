import { Box, Text } from 'ink';
import {
  PANEL_BORDER_STYLE,
  PANEL_SELECTED_COLOR,
  PANEL_UNSELECTED_COLOR,
} from '../constants/main.constants.js';

const REGISTER_SIZE = 5;

type CodeProps = {
  selected: boolean;
  registers: boolean;
  tape: string;
  assemblyFile?: string;
};

export function Code({ selected, assemblyFile, registers, tape }: CodeProps): React.JSX.Element {
  const eax_index = registers ? tape.lastIndexOf('A') : -1;
  const ebx_index = registers ? tape.lastIndexOf('B') : -1;
  const ecx_index = registers ? tape.lastIndexOf('C') : -1;
  const edx_index = registers ? tape.lastIndexOf('D') : -1;
  const eax =
    registers && eax_index !== -1 ? tape.slice(eax_index, eax_index + REGISTER_SIZE) : null;
  const ebx =
    registers && ebx_index !== -1 ? tape.slice(ebx_index, ebx_index + REGISTER_SIZE) : null;
  const ecx =
    registers && ecx_index !== -1 ? tape.slice(ecx_index, ecx_index + REGISTER_SIZE) : null;
  const edx =
    registers && edx_index !== -1 ? tape.slice(edx_index, edx_index + REGISTER_SIZE) : null;

  return (
    <Box
      flexDirection="column"
      borderColor={selected ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
      borderStyle={PANEL_BORDER_STYLE}
      height={14}
    >
      <Box height={8} flexDirection="column" rowGap={1}>
        <Box>
          <Box flexDirection="row">
            <Box marginRight={1}>
              <Text color="green">[c]</Text>
            </Box>
            <Text>Code</Text>
          </Box>
          {assemblyFile && (
            <Box>
              <Text>Assembly File: {assemblyFile}</Text>
            </Box>
          )}
        </Box>
        <Box height={5} flexDirection="column">
          {assemblyFile ? (
            <Text>Feature coming soon...</Text>
          ) : (
            <>
              <Text>No assembly file provided</Text>
              <Text dimColor italic>
                Launch the debugger with {'-s, --assembly-file <path>'}
              </Text>
            </>
          )}
        </Box>
      </Box>

      {registers && (
        <Box flexDirection="column" height={3} rowGap={1}>
          <Box marginLeft={4}>
            <Text>Registers</Text>
          </Box>
          <Box>
            {!eax && !ebx && !ecx && !edx && <Text>Step to initialize registers</Text>}
            {eax && ebx && ecx && edx && (
              <Text>
                EAX: {eax} EBX: {ebx} ECX: {ecx} EDX: {edx}
              </Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
