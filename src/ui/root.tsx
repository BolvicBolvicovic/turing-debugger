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
import { LEFT_PANEL_WIDTH, PANEL_HEIGHT } from './constants/main.constants.js';

interface RootProps {
  machine: TuringMachine;
  debuggeeArgs: DebuggeeArgs;
  assemblyFile?: string;
  onExit?: () => void;
}

export function Root({
  machine,
  debuggeeArgs,
  assemblyFile,
  onExit,
}: RootProps): React.JSX.Element {
  const { exit } = useApp();

  // Tape state
  const [currentState, setCurrentState] = useState<Step>({
    input: debuggeeArgs.machineInput + machine.blank.repeat(10),
    state: machine.initial,
    head: 0,
  });
  const [viewIndex, setViewIndex] = useState(1);

  // Panel state
  const [selectedPanel, setSelectedPanel] = useState<PanelType>(PanelType.TAPE);

  useInput(async (input, key) => {
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
        const nextStep = await commands.nextStep();
        setCurrentState(nextStep);
        setViewIndex(nextStep.head + 1);
        break;
      case 't':
        setSelectedPanel(PanelType.TAPE);
        break;
      case 'r':
        setSelectedPanel(PanelType.TRANSITIONS);
        break;
      case 'c':
        setSelectedPanel(PanelType.CODE);
        break;
      case 'b':
        setSelectedPanel(PanelType.BREAKPOINTS);
        break;
      default:
        break;
    }

    if (key.leftArrow) {
      switch (selectedPanel) {
        case PanelType.TRANSITIONS:
        case PanelType.CODE:
        case PanelType.BREAKPOINTS:
          return;
        case PanelType.TAPE:
          setViewIndex(viewIndex === 1 ? 1 : viewIndex - 1);
          break;
      }
    }

    if (key.rightArrow) {
      switch (selectedPanel) {
        case PanelType.TRANSITIONS:
        case PanelType.CODE:
        case PanelType.BREAKPOINTS:
          return;
        case PanelType.TAPE:
          setViewIndex(viewIndex < currentState.input.length ? viewIndex + 1 : viewIndex);
          break;
      }
    }
  });

  return (
    <Box flexDirection="row" borderColor={'blue'} borderStyle={'double'} justifyContent="center">
      <Box flexDirection="column" marginRight={1} width={LEFT_PANEL_WIDTH} height={PANEL_HEIGHT}>
        <Tape
          input={currentState.input}
          viewIndex={viewIndex}
          headPosition={currentState.head}
          selected={selectedPanel === PanelType.TAPE}
        />
        <Breakpoints selected={selectedPanel === PanelType.BREAKPOINTS} />
        <Code selected={selectedPanel === PanelType.CODE} assemblyFile={assemblyFile} />
      </Box>
      <Box flexDirection={'column'} marginRight={1} height={PANEL_HEIGHT}>
        <Transitions
          currentState={currentState}
          transitions={machine.transitions}
          finals={machine.finals}
          selected={selectedPanel === PanelType.TRANSITIONS}
        />
        <Helper />
      </Box>
    </Box>
  );
}
