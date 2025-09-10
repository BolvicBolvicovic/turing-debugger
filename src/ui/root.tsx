import { useState } from 'react';
import { Box, useInput, useApp } from 'ink';
import type { Step, TuringMachine } from '../utils/types/parser.types.js';
import { Tape } from './tape/index.js';
import { DebuggeeArgs } from '../cli/cli.types.js';
import { commands } from '../client/commands.js';
import { PanelType } from './types/panels.type.js';
import { Helper } from './helper/index.js';
import { Code } from './code/index.js';
import { Breakpoints } from './breakpoints/index.js';
import { Transitions } from './transitions/index.js';
import { LEFT_PANEL_WIDTH, PANEL_HEIGHT, RIGHT_PANEL_WIDTH } from './constants/main.constants.js';
import { parser } from '../utils/parser.js';

interface RootProps {
  machine: TuringMachine;
  debuggeeArgs: DebuggeeArgs;
  assemblyFile?: string;
  registers: boolean;
  onExit?: () => void;
}

export function Root({
  machine,
  debuggeeArgs,
  assemblyFile,
  registers,
  onExit,
}: RootProps): React.JSX.Element {
  const { exit } = useApp();

  // General writing state
  const [writing, setWriting] = useState(false);

  // Transitions content state
  const fullTransitionContent = parser.mapTransitionsToContent(
    machine.transitions,
    Object.keys(machine.transitions).concat(machine.finals)
  );

  // Tape state
  const [currentState, setCurrentState] = useState<Step>({
    input: debuggeeArgs.machineInput + machine.blank.repeat(10),
    state: machine.initial,
    head: 0,
  });

  // Panel state
  const [selectedPanel, setSelectedPanel] = useState<PanelType>(PanelType.TAPE);

  useInput(async (input, key) => {
    if (!writing) {
      if (key.escape || input === 'q') {
        onExit?.();
        exit();
      }
      switch (input) {
        case 's':
          if (machine.finals.includes(currentState.state)) {
            onExit?.();
            exit();
            return;
          }
          // eslint-disable-next-line
          const nextStep = await commands.step();
          setCurrentState(nextStep);
          break;
        case 'r':
          if (machine.finals.includes(currentState.state)) {
            onExit?.();
            exit();
            return;
          }
          // eslint-disable-next-line
          const runStep = await commands.run();
          setCurrentState(runStep);
          break;
        case 't':
          setSelectedPanel(PanelType.TAPE);
          break;
        case 'i':
          setSelectedPanel(PanelType.TRANSITIONS);
          break;
        case 'c':
          setSelectedPanel(PanelType.CODE);
          break;
        case 'b':
          setSelectedPanel(PanelType.BREAKPOINTS);
          break;
        case 'h':
          setSelectedPanel(PanelType.HELPER);
          break;
        default:
          break;
      }
    }
  });

  return (
    <Box flexDirection="row" borderColor={'blue'} borderStyle={'double'} justifyContent="center">
      <Box flexDirection="column" marginRight={1} width={LEFT_PANEL_WIDTH} height={PANEL_HEIGHT}>
        <Tape
          input={currentState.input}
          headPosition={currentState.head}
          selected={selectedPanel === PanelType.TAPE}
        />
        <Breakpoints
          selected={selectedPanel === PanelType.BREAKPOINTS}
          writing={writing}
          setWriting={setWriting}
          states={Object.keys(machine.transitions).concat(machine.finals)}
          alphabet={machine.alphabet}
        />
        <Code
          selected={selectedPanel === PanelType.CODE}
          assemblyFile={assemblyFile}
          registers={registers}
          tape={currentState.input}
        />
      </Box>
      <Box flexDirection={'column'} marginRight={1} width={RIGHT_PANEL_WIDTH} height={PANEL_HEIGHT}>
        <Transitions
          currentState={currentState}
          transitions={machine.transitions}
          finals={machine.finals}
          selected={selectedPanel === PanelType.TRANSITIONS}
          fullContent={fullTransitionContent}
          blank={machine.blank}
        />
        <Helper
          selected={selectedPanel === PanelType.HELPER}
          writing={writing}
          setWriting={setWriting}
        />
      </Box>
    </Box>
  );
}
