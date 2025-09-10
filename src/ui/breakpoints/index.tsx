import { Box, Text, useInput } from 'ink';
import {
  PANEL_SELECTED_COLOR,
  PANEL_UNSELECTED_COLOR,
  PANEL_BORDER_STYLE,
} from '../constants/main.constants.js';
import { Input } from '../components/input.js';
import { useEffect, useState } from 'react';
import { BreakpointType, CurrentInput } from '../types/breakpoints.type.js';
import { removeBreakpoint, setBreakpoint } from './utils.js';

const BP_INPUT_WIDTH = 15;
const MAX_VISIBLE_BREAKPOINTS = 3;

type BreakpointsProps = {
  selected: boolean;
  writing: boolean;
  setWriting: (writing: boolean) => void;
  states: string[];
  alphabet: string[];
};

export function Breakpoints({
  selected,
  writing,
  setWriting,
  states,
  alphabet,
}: BreakpointsProps): React.JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selecting, setSelecting] = useState<boolean>(false);
  const [breakpoints, setBreakpoints] = useState<BreakpointType[]>([]);
  const [lineOffset, setLineOffset] = useState<number>(0);

  // Success or error message
  const [message, setMessage] = useState<string>('');

  // Add breakpoint states
  const [currentInput, setCurrentInput] = useState<CurrentInput>(CurrentInput.STATE_NAME);
  const [stateName, setStateName] = useState<string>('');
  const [readSymbol, setReadSymbol] = useState<string>('');

  useEffect(() => {
    if (selected) {
      setCurrentInput(CurrentInput.STATE_NAME);
      setStateName('');
      setReadSymbol('');
      setMessage('');
      setSelecting(false);
      setSelectedIndex(0);
      setLineOffset(0);
      return;
    } else {
      setWriting(false);
      setSelecting(false);
      setMessage("Press 'b' to select the Breakpoints panel.");
    }
  }, [selected]);

  useInput(async (inpt, key) => {
    if (!selected) return;

    if (key.return) {
      if (breakpoints.some(bp => bp.stateName === stateName && bp.readSymbol === readSymbol)) {
        setMessage('Breakpoint already exists.');
        return;
      }

      const { sent, message } = await setBreakpoint(
        { stateName, readSymbol },
        true,
        states,
        alphabet
      );
      setMessage(message);
      if (!sent) return;

      setStateName('');
      setReadSymbol('');
      setCurrentInput(CurrentInput.STATE_NAME);
      setWriting(false);
      setBreakpoints(prev => [...prev, { stateName, readSymbol }]);
      return;
    }

    if (selecting && !writing) {
      if (key.upArrow) {
        setSelectedIndex(i => {
          const newIndex = i === 0 ? Math.max(0, breakpoints.length - 1) : i - 1;

          // Update line offset if needed
          setLineOffset(currentOffset => {
            if (newIndex < currentOffset) {
              return newIndex;
            }
            if (newIndex >= currentOffset + MAX_VISIBLE_BREAKPOINTS) {
              return Math.max(0, newIndex - MAX_VISIBLE_BREAKPOINTS + 1);
            }
            return currentOffset;
          });

          return newIndex;
        });
        return;
      }
      if (key.downArrow) {
        setSelectedIndex(i => {
          const newIndex = i === breakpoints.length - 1 ? 0 : i + 1;

          // Update line offset if needed
          setLineOffset(currentOffset => {
            if (newIndex < currentOffset) {
              return newIndex;
            }
            if (newIndex >= currentOffset + MAX_VISIBLE_BREAKPOINTS) {
              return Math.max(0, newIndex - MAX_VISIBLE_BREAKPOINTS + 1);
            }
            return currentOffset;
          });

          return newIndex;
        });
        return;
      }
      if (inpt === 'd' && breakpoints.length > 0) {
        const { removed, message } = await removeBreakpoint(breakpoints[selectedIndex]);
        setMessage(message);
        if (!removed) return;

        const newBps = breakpoints.filter((_, i) => i !== selectedIndex);
        setBreakpoints(newBps);

        // Adjust selected index and line offset after deletion
        setSelectedIndex(i => {
          const newIndex = i === 0 ? 0 : i - 1;

          // Adjust line offset if necessary
          setLineOffset(currentOffset => {
            const maxOffset = Math.max(0, newBps.length - MAX_VISIBLE_BREAKPOINTS);
            if (currentOffset > maxOffset) {
              return maxOffset;
            }
            if (newIndex < currentOffset) {
              return Math.max(0, newIndex);
            }
            return currentOffset;
          });

          return newIndex;
        });
      }
    }

    if (writing) {
      if (key.tab) {
        setCurrentInput(prev =>
          prev === CurrentInput.STATE_NAME ? CurrentInput.READ_SYMBOL : CurrentInput.STATE_NAME
        );

        const { message } = await setBreakpoint({ stateName, readSymbol }, false, states, alphabet);
        setMessage(message);
        return;
      }

      if (key.escape) {
        setWriting(false);

        const { message } = await setBreakpoint({ stateName, readSymbol }, false, states, alphabet);
        setMessage(message);
        return;
      }
    } else {
      switch (inpt) {
        case 'w':
          setWriting(true);
          setSelecting(false);
          break;
        case 'f':
          if (breakpoints.length === 0) {
            setMessage('No breakpoints to select.');
            return;
          }
          setSelecting(s => !s);
          break;
      }
    }
  });

  return (
    <Box
      flexDirection="column"
      borderColor={selected ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
      borderStyle={PANEL_BORDER_STYLE}
      height={14}
    >
      <Box flexDirection="row" alignItems="center">
        <Input
          borderStyle="round"
          width={BP_INPUT_WIDTH * 2 + 4}
          selected={selected && currentInput === CurrentInput.STATE_NAME}
          generalWriting={writing}
          input={stateName}
          setInput={setStateName}
          placeholder="State name"
        />
        <Input
          borderStyle="round"
          width={BP_INPUT_WIDTH}
          selected={selected && currentInput === CurrentInput.READ_SYMBOL}
          generalWriting={writing}
          input={readSymbol}
          setInput={setReadSymbol}
          placeholder="Read symbol"
          maxLength={1}
        />
      </Box>
      <Box height={1}>
        <Text dimColor={!selected} italic={!selected}>
          {message}
        </Text>
      </Box>
      <Box flexDirection="column" borderStyle="classic" height={5}>
        {breakpoints.length === 0 && <Text>No breakpoints set.</Text>}
        {breakpoints.length > 0 && (
          <>
            {lineOffset > 0 && <Text dimColor>↑ {lineOffset} more above</Text>}
            {breakpoints
              .slice(lineOffset, lineOffset + MAX_VISIBLE_BREAKPOINTS)
              .map((bp, displayIndex) => {
                const actualIndex = lineOffset + displayIndex;
                return (
                  <Box key={`${bp.stateName}-${bp.readSymbol}`}>
                    <Text
                      color={
                        selecting && selectedIndex === actualIndex
                          ? PANEL_SELECTED_COLOR
                          : undefined
                      }
                    >
                      {selecting && selectedIndex === actualIndex ? '→ ' : '  '}
                      {`State: "${bp.stateName}", Read: "${bp.readSymbol}"`}
                    </Text>
                  </Box>
                );
              })}
            {lineOffset + MAX_VISIBLE_BREAKPOINTS < breakpoints.length && (
              <Text dimColor>
                ↓ {breakpoints.length - lineOffset - MAX_VISIBLE_BREAKPOINTS} more below
              </Text>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
