import { Box, Text, useInput } from 'ink';
import {
  PANEL_SELECTED_COLOR,
  PANEL_UNSELECTED_COLOR,
  PANEL_BORDER_STYLE,
  PANEL_HEIGHT,
} from '../constants/main.constants.js';
import { Step, Transitions } from '../../utils/types/parser.types.js';
import { useState, useEffect } from 'react';

// PANEL_HEIGHT - approximative Helper box height
const HEIGHT = PANEL_HEIGHT - 10;
// HEIGHT - title (3) - currentState (1)
const DRAWABLE_HEIGHT = HEIGHT - 4;

function mapTransitionToString({
  read,
  write,
  action,
  to_state,
}: Transitions[string][number]): string {
  return `read: ${read}, write: ${write}, action: ${action}, to_state: ${to_state}`;
}

type TransitionsProps = {
  currentState: Step;
  transitions: Transitions;
  finals: string[];
  selected: boolean;
};

export function Transitions({
  currentState,
  transitions,
  finals,
  selected,
}: TransitionsProps): React.JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(currentState.state);
  // TODO: Turn this into an array so that multiple states can be unwrapped at once
  const [unwrapped, setUnwrapped] = useState<string | null>(selectedState ?? currentState.state);

  const currentTransitions = unwrapped ? (transitions[unwrapped] ?? []) : [];
  const read = currentState.input[currentState.head];
  const applicableTransitionIndex =
    currentTransitions.map((t, i) => (t.read === read ? i : -1)).filter(i => i !== -1) ?? [];

  useEffect(() => {
    if (
      unwrapped &&
      applicableTransitionIndex.length === 0 &&
      !finals.includes(currentState.state)
    ) {
      setError(`No transition found for state "${currentState.state}" with read symbol "${read}".`);
    } else if (applicableTransitionIndex.length > 1) {
      setError(
        `Multiple transitions found for state "${currentState.state}" with read symbol "${read}".`
      );
    } else if (read === undefined) {
      setError(`The head is out of the tape bounds.`);
    } else {
      setError(null);
    }
  }, [applicableTransitionIndex.length, currentState.state, read]);

  const maxTransitionsHeight = DRAWABLE_HEIGHT - (error ? 1 : 0);

  const visibleTransitions =
    currentTransitions.length <= maxTransitionsHeight
      ? currentTransitions.map(mapTransitionToString)
      : applicableTransitionIndex[0] <= maxTransitionsHeight / 2
        ? currentTransitions
            .map(mapTransitionToString)
            .slice(0, maxTransitionsHeight - 1)
            .concat(['...'])
        : currentTransitions.length - applicableTransitionIndex[0] <= maxTransitionsHeight / 2
          ? ['...'].concat(
              currentTransitions.map(mapTransitionToString).slice(-maxTransitionsHeight + 1)
            )
          : ['...'].concat(
              currentTransitions
                .map(mapTransitionToString)
                .slice(
                  applicableTransitionIndex[0] - (maxTransitionsHeight / 2 - 1),
                  applicableTransitionIndex[0] + maxTransitionsHeight / 2 - 1
                )
                .concat(['...'])
            );

  const maxStatesHeight = DRAWABLE_HEIGHT - visibleTransitions.length + (error ? 0 : 1);
  const states = Object.keys(transitions).concat(finals);
  const visibleStates =
    states.length <= maxStatesHeight
      ? states
      : states.slice(states.indexOf(currentState.state + 1), maxStatesHeight);

  useInput((input, key) => {
    if (selected) {
      if (input === ' ') {
        setUnwrapped(unwrapped === selectedState ? null : selectedState);
      }
      if (key.upArrow) {
        setSelectedState(prev => states[prev === null ? 0 : states.indexOf(prev) - 1] ?? prev);
      }
      if (key.downArrow) {
        setSelectedState(prev => states[prev === null ? 0 : states.indexOf(prev) + 1] ?? prev);
      }
    }
  });

  return (
    <Box
      flexDirection="column"
      borderColor={selected ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
      borderStyle={PANEL_BORDER_STYLE}
      height={HEIGHT}
      width="full"
    >
      <Box marginBottom={1}>
        <Box marginRight={1}>
          <Text color="green">[r]</Text>
        </Box>
        <Text>Transitions Panel</Text>
        {error && <Text color="red">{error}</Text>}
      </Box>
      <Box flexDirection="column">
        {visibleStates.map(s =>
          unwrapped && s === unwrapped ? (
            <>
              <Text
                bold
                color={s === currentState.state ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
                inverse={s === selectedState}
                wrap="truncate"
              >
                {!finals.includes(s) ? '▼' : '►'} {s}
              </Text>
              {visibleTransitions.map(t => (
                <Box key={t} paddingLeft={1}>
                  <Text
                    color={
                      s === currentState.state && t.includes(`read: ${read}`)
                        ? PANEL_SELECTED_COLOR
                        : PANEL_UNSELECTED_COLOR
                    }
                    wrap="truncate"
                  >
                    {t}
                  </Text>
                </Box>
              ))}
            </>
          ) : (
            <Text
              color={s === currentState.state ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
              inverse={s === selectedState}
              wrap="truncate"
            >
              ► {s}
            </Text>
          )
        )}
      </Box>
    </Box>
  );
}
