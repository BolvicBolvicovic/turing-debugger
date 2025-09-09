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
const DEFAULT_DRAWABLE_HEIGHT = HEIGHT - 4;
// Based on console.log(">_LEFT_get_current_state_0:mov_eax0001_return                  ".length)
const DRAWABLE_LINE_WIDTH = 63;

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

function calculatePageOffset(
  selectedLineIndex: number,
  previousOffset: number,
  drawableHeight: number
): number {
  if (selectedLineIndex < previousOffset) {
    return selectedLineIndex;
  }
  if (selectedLineIndex >= previousOffset + drawableHeight) {
    return selectedLineIndex - drawableHeight + 1;
  }
  return previousOffset;
}

type TransitionsProps = {
  currentState: Step;
  transitions: Transitions;
  fullContent: Line[];
  finals: string[];
  selected: boolean;
  blank: string;
};

export function Transitions({
  currentState,
  transitions,
  fullContent,
  finals,
  selected,
  blank,
}: TransitionsProps): React.JSX.Element {
  const read = currentState.input[currentState.head] || blank;
  const statesLength = Object.keys(transitions).length;

  const [error, setError] = useState<string | null>(null);
  const [DRAWABLE_HEIGHT, setDrawableHeight] = useState(DEFAULT_DRAWABLE_HEIGHT);
  const [unwrappedStates, setUnwrappedStates] = useState<Set<string>>(
    new Set([currentState.state])
  );
  const [content, setContent] = useState<Line[]>(updateContent(fullContent, unwrappedStates));
  const [selectedLine, setSelectedLine] = useState<number>(
    findCurrentLineIndex(content, currentState.state) || 0
  );
  const [pageOffset, setPageOffset] = useState(
    calculatePageOffset(selectedLine, 0, DRAWABLE_HEIGHT)
  );
  const [lineOffset, setLineOffset] = useState(0);

  useEffect(() => {
    const applicableTransitionIndex = transitions[currentState.state]
      ? transitions[currentState.state]
          .map((rule, index) => (rule.read === read ? index : -1))
          .filter(index => index !== -1)
      : [];

    let newDrawableHeight = DRAWABLE_HEIGHT;
    if (
      unwrappedStates.size > 0 &&
      applicableTransitionIndex.length === 0 &&
      !finals.includes(currentState.state)
    ) {
      setError(`No transition found for state "${currentState.state}" with read symbol "${read}".`);
      newDrawableHeight = DEFAULT_DRAWABLE_HEIGHT - 2;
    } else if (applicableTransitionIndex.length > 1) {
      setError(
        `(Warning) Multiple transitions found for state "${currentState.state}" with read symbol "${read}".`
      );
      newDrawableHeight = DEFAULT_DRAWABLE_HEIGHT - 2;
    } else if (read === undefined) {
      setError(`The head is out of the tape bounds.`);
      newDrawableHeight = DEFAULT_DRAWABLE_HEIGHT - 2;
    } else {
      setError(null);
      newDrawableHeight = DEFAULT_DRAWABLE_HEIGHT;
    }

    const newUnwrappedStates = new Set([currentState.state]);
    const newContent = updateContent(fullContent, newUnwrappedStates);
    const newSelectedLine = findCurrentLineIndex(newContent, currentState.state) || 0;
    const newPageOffset = calculatePageOffset(
      newSelectedLine + newDrawableHeight - 1,
      pageOffset,
      newDrawableHeight
    );

    setDrawableHeight(newDrawableHeight);
    setContent(newContent);
    setSelectedLine(newSelectedLine);
    setPageOffset(newPageOffset);
    setUnwrappedStates(newUnwrappedStates);
    setLineOffset(0);
  }, [currentState.head]);

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
          const newPageOffset = calculatePageOffset(newSelectedLine, pageOffset, DRAWABLE_HEIGHT);

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
          setPageOffset(calculatePageOffset(newSelectedLine, pageOffset, DRAWABLE_HEIGHT));
        }
      }
      if (key.downArrow) {
        if (selectedLine < content.length - 1) {
          const newSelectedLine = selectedLine + 1;

          setSelectedLine(newSelectedLine);
          setPageOffset(calculatePageOffset(newSelectedLine, pageOffset, DRAWABLE_HEIGHT));
        }
      }

      if (key.leftArrow) {
        if (lineOffset > 0) {
          setLineOffset(lineOffset - 1);
        }
      }

      if (key.rightArrow) {
        if (content[selectedLine].text.length > lineOffset + DRAWABLE_LINE_WIDTH) {
          setLineOffset(lineOffset + 1);
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
      <Box marginBottom={1} flexDirection="column">
        <Box flexDirection="row">
          <Box marginRight={1}>
            <Text color="green">[i]</Text>
          </Box>
          <Text>
            Transitions Panel: States: {statesLength} - Transitions:{' '}
            {fullContent.length - statesLength}
          </Text>
        </Box>
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
                key={`${line.type}-${line.text}`}
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
                  {line.text.slice(lineOffset)}
                </Text>
              </Box>
            );
          });
        })()}
      </Box>
    </Box>
  );
}
