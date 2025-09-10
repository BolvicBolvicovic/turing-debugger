import { Box, Text, useInput } from 'ink';
import {
  PANEL_UNSELECTED_COLOR,
  PANEL_BORDER_STYLE,
  PANEL_SELECTED_COLOR,
} from '../constants/main.constants.js';
import { useEffect, useState } from 'react';
import { man } from '../../man/index.js';
import { Input } from '../components/input.js';

type HelperProps = {
  selected: boolean;
  writing: boolean;
  setWriting: (writing: boolean) => void;
};

export function Helper({ selected, writing, setWriting }: HelperProps): React.JSX.Element {
  const [input, setInput] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);
  const [resultOffset, setResultOffset] = useState(0);

  useEffect(() => {
    setResults(man.search(input));
  }, [input]);

  useInput((inpt, key) => {
    if (selected) {
      if (results.length > man.MAX_RESULTS) {
        if (key.upArrow) {
          setResultOffset(prev => Math.max(0, prev - 1));
          return;
        } else if (key.downArrow) {
          setResultOffset(prev =>
            Math.min(Math.max(0, results.length - man.MAX_RESULTS), prev + 1)
          );
          return;
        }
      }

      if (!writing) {
        if (inpt === 'w') {
          setInput('');
          setWriting(true);
        }
      } else {
        if (key.escape) {
          setWriting(false);
        }
      }
    }
  });

  return (
    <Box
      flexDirection="column"
      borderStyle={PANEL_BORDER_STYLE}
      borderColor={selected ? PANEL_SELECTED_COLOR : PANEL_UNSELECTED_COLOR}
      justifyContent="space-between"
      height={10}
    >
      <Box flexDirection="column" marginRight={2}>
        <Input
          borderStyle="round"
          selected={selected}
          generalWriting={writing}
          input={input}
          setInput={setInput}
          panelActionText='Press "h" for help panel...'
        />
        {(writing || (input && results !== man.NO_INPUT && results !== man.NO_RESULTS)) && (
          <Text color="gray" dimColor>
            {results.length === 1 && (input.length === 0 || results === man.NO_RESULTS)
              ? 0
              : results.length}{' '}
            result{results.length !== 1 ? 's' : ''} found
          </Text>
        )}
        {(writing || (input && results !== man.NO_INPUT && results !== man.NO_RESULTS)) &&
          results
            .slice(resultOffset, resultOffset + man.MAX_RESULTS)
            .map(line => <Text key={line}>{line}</Text>)}
      </Box>
    </Box>
  );
}
