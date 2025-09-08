const NO_RESULTS = ['No results found'];
const NO_INPUT = ['Enter a search query'];

const STEP = ["Press 's' to step."];

const PANEL_HELP = [
  "Press 'h' to toggle this panel.",
  "Press 'w' to start writing.",
  'Press <enter> to stop searching.',
];
const PANEL_TRANSITIONS = [
  "Press 't' to select the Transitions panel.",
  'Press <space> to wrap/unwrap the selected transition.',
  'Use up/down arrows to navigate.',
];
const PANEL_TAPE = [
  "Press 't' to select the Tape panel.",
  'Use left/right arrows to navigate the tape.',
];
const PANEL_CODE = ["Press 'c' to select the Code panel."];
const PANEL_BREAKPOINTS = ["Press 'b' to select the Breakpoints panel."];

function search(input: string): string[] {
  if (input.length === 0) {
    return NO_INPUT;
  }

  let output: string[] = NO_RESULTS;

  if (input.includes('help')) {
    output = PANEL_HELP;
  }
  if (input.includes('transitions')) {
    output.concat(PANEL_TRANSITIONS);
  }
  if (input.includes('tape')) {
    output.concat(PANEL_TAPE);
  }
  if (input.includes('code')) {
    output.concat(PANEL_CODE);
  }
  if (input.includes('breakpoints')) {
    output.concat(PANEL_BREAKPOINTS);
  }
  if (input.includes('step')) {
    output.concat(STEP);
  }

  if (output.length > 1) {
    return output.slice(1);
  }

  return output;
}

export const man = {
  search,
};
