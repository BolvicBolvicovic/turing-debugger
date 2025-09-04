function trimChar(str: string, char: string): string {
  const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedChar}+|${escapedChar}+$`, 'g');
  return str.replace(regex, '');
}

function clearScreen(): void {
  process.stdout.write('\x1b[2J\x1b[0f');
}

export const lib = { trimChar, clearScreen };
