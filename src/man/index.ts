const MAX_RESULTS = 3;

const NO_RESULTS = ['No results found'];
const NO_INPUT = ['Enter a search query'];

const manuel: Record<string, string[]> = {
  step: ["Press 's' to step."],
  run: ["Press 'r' to run until the next breakpoint or halt."],
  quit: ["Press 'q', <ctrl+c> or <escape> to quit."],
  help: [
    "Press 'h' to toggle this panel.",
    "Press 'w' to start writing.",
    'Press <esc> to stop searching.',
  ],
  transitions: [
    "Press 'i' to select the Transitions panel.",
    'Press <space> to wrap/unwrap the selected transition.',
    'Use up/down and left/right arrows to navigate.',
  ],
  tape: ["Press 't' to select the Tape panel.", 'Use left/right arrows to navigate the tape.'],
  code: ["Press 'c' to select the Code panel."],
  breakpoints: ["Press 'b' to select the Breakpoints panel."],
};

function jaroWinkler(s1: string, s2: string): number {
  const matchDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
  const s1Matches = new Array(s1.length).fill(false);
  const s2Matches = new Array(s2.length).fill(false);

  let matches = 0;
  for (let i = 0; i < s1.length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, s2.length);

    for (let j = start; j < end; j++) {
      if (s2Matches[j]) continue;
      if (s1[i] !== s2[j]) continue;
      s1Matches[i] = true;
      s2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0;

  let transpositions = 0;
  let k = 0;
  for (let i = 0; i < s1.length; i++) {
    if (!s1Matches[i]) continue;
    while (!s2Matches[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }
  transpositions /= 2;

  const jaro =
    (matches / s1.length + matches / s2.length + (matches - transpositions) / matches) / 3;

  let prefixLength = 0;
  while (prefixLength < 4 && s1[prefixLength] === s2[prefixLength]) prefixLength++;

  const scalingFactor = 0.1;
  return jaro + prefixLength * scalingFactor * (1 - jaro);
}

function search(input: string): string[] {
  if (input.length === 0) {
    return NO_INPUT;
  }

  const exactMatch = manuel[input];
  if (exactMatch) {
    return exactMatch;
  }

  const manuelKeys = Object.keys(manuel);

  let prefixMatches: string[] = [];
  let containsMatches: string[] = [];

  for (const key of manuelKeys) {
    if (key.startsWith(input)) {
      prefixMatches = prefixMatches.concat(manuel[key]);
    } else if (key.includes(input)) {
      containsMatches = containsMatches.concat(manuel[key]);
    }
  }

  const results = [...prefixMatches, ...containsMatches];

  if (results.length > 0) {
    return results.slice(0, MAX_RESULTS);
  }

  const scored: { key: string; score: number }[] = manuelKeys.map(key => ({
    key,
    score: jaroWinkler(input, key),
  }));

  scored.sort((a, b) => b.score - a.score);

  const topMatches = scored
    .slice(0, 2)
    .filter(item => item.score > 0.7)
    .map(item => item.key);
  if (topMatches.length > 0) {
    return [`Did you mean: ${topMatches.join(' or ')}?`];
  }

  return NO_RESULTS;
}

export const man = {
  search,
  NO_RESULTS,
  NO_INPUT,
};
