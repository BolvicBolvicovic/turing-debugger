function trimChar(str: string, char: string): string {
  const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedChar}+|${escapedChar}+$`, 'g');
  return str.replace(regex, '');
}

function trimCharEnd(str: string, char: string): string {
  const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escapedChar}+$`, 'g');
  return str.replace(regex, '');
}

export const lib = { trimChar, trimCharEnd };
