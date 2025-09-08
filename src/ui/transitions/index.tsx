import { Box, Text, useInput } from 'ink';
import {
  PANEL_SELECTED_COLOR,
  PANEL_UNSELECTED_COLOR,
  PANEL_BORDER_STYLE,
  PANEL_HEIGHT,
} from '../constants/main.constants.js';
import { Line, Step, Transitions } from '../../utils/types/parser.types.js';
import { useState, useEffect, JSX } from 'react';

// PANEL_HEIGHT - approximative Helper box height
const HEIGHT = PANEL_HEIGHT - 10;
// HEIGHT - title (up to 6 on error)
const DRAWABLE_HEIGHT = HEIGHT - 6;

function updateContent(fullContent: Line[], unwrappedStates: Set<string>): Line[] {
  return fullContent.filter(
    line =>
      line.type === 'state' ||
      (line.type === 'transition' && unwrappedStates.has(line.parent || ''))
  );
}

function findCurrentLineIndex(content: Line[], state: string): number | undefined {
  return content.findIndex(line => line.text === state && line.type === 'state');
}

function calculatePageOffset(selectedLineIndex: number, previousOffset: number): number {
  if (selectedLineIndex < previousOffset) {
    return selectedLineIndex;
  }
  if (selectedLineIndex >= previousOffset + DRAWABLE_HEIGHT) {
    return selectedLineIndex - DRAWABLE_HEIGHT + 1;
  }
  return previousOffset;
}

type TransitionsProps = {
  currentState: Step;
  transitions: Transitions;
  fullContent: Line[];
  finals: string[];
  selected: boolean;
};

export function Transitions({
  currentState,
  transitions,
  fullContent,
  finals,
  selected,
}: TransitionsProps): React.JSX.Element {
  const read = currentState.input[currentState.head];
  const statesLength = Object.keys(transitions).length;

  const [error, setError] = useState<string | null>(null);
  const [unwrappedStates, setUnwrappedStates] = useState<Set<string>>(
    new Set([currentState.state])
  );
  const [content, setContent] = useState<Line[]>(updateContent(fullContent, unwrappedStates));
  const [selectedLine, setSelectedLine] = useState<number>(
    findCurrentLineIndex(content, currentState.state) || 0
  );
  const [pageOffset, setPageOffset] = useState(calculatePageOffset(selectedLine, 0));

  useEffect(() => {
    const applicableTransitionIndex = transitions[currentState.state]
      ? transitions[currentState.state]
          .map((rule, index) => (rule.read === read ? index : -1))
          .filter(index => index !== -1)
      : [];

    if (
      unwrappedStates.size > 0 &&
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

    const newContent = updateContent(fullContent, unwrappedStates);
    const newSelectedLine = findCurrentLineIndex(newContent, content[selectedLine].text) || 0;
    const newPageOffset = calculatePageOffset(newSelectedLine, pageOffset);

    setContent(newContent);
    setSelectedLine(newSelectedLine);
    setPageOffset(newPageOffset);
  }, [currentState.state]);

  useInput((input, key) => {
    if (selected) {
      if (
        input === ' ' &&
        content[selectedLine].type === 'state' &&
        !finals.includes(content[selectedLine].text)
      ) {
        setUnwrappedStates(set => {
          const newSet = new Set(set);

          if (newSet.has(content[selectedLine].text)) {
            newSet.delete(content[selectedLine].text);
          } else {
            newSet.add(content[selectedLine].text);
          }

          const newContent = updateContent(fullContent, newSet);
          const newSelectedLine = findCurrentLineIndex(newContent, content[selectedLine].text) || 0;
          const newPageOffset = calculatePageOffset(newSelectedLine, pageOffset);

          setContent(newContent);
          setSelectedLine(newSelectedLine);
          setPageOffset(newPageOffset);

          return newSet;
        });
      }
      if (key.upArrow) {
        if (selectedLine > 0) {
          const newSelectedLine = selectedLine - 1;

          setSelectedLine(newSelectedLine);
          setPageOffset(calculatePageOffset(newSelectedLine, pageOffset));
        }
      }
      if (key.downArrow) {
        if (selectedLine < content.length - 1) {
          const newSelectedLine = selectedLine + 1;

          setSelectedLine(newSelectedLine);
          setPageOffset(calculatePageOffset(newSelectedLine, pageOffset));
        }
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
        <Text>
          Transitions Panel: States: {statesLength} - Transitions:{' '}
          {fullContent.length - statesLength}
        </Text>
        {error && <Text color="red">{error}</Text>}
      </Box>
      <Box flexDirection="column">
        {((): JSX.Element[] => {
          const slice = content.slice(pageOffset, pageOffset + DRAWABLE_HEIGHT);
          return slice.map((line, index) => {
            const current =
              (line.text === currentState.state && line.type === 'state') ||
              (line.text.includes(`read: ${read},`) &&
                line.type === 'transition' &&
                line.parent === currentState.state);
            return (
              <Box
                key={`${line.type}-${line.index}`}
                paddingLeft={line.type === 'transition' ? 1 : 0}
              >
                <Text
                  bold={current}
                  color={current ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
                  inverse={content[selectedLine] === slice[index]}
                  wrap="truncate"
                >
                  {line.type === 'state'
                    ? !finals.includes(line.text) && unwrappedStates.has(line.text)
                      ? '▼'
                      : '►'
                    : '•'}{' '}
                  {line.text}
                </Text>
              </Box>
            );
          });
        })()}
      </Box>
    </Box>
  );
}
