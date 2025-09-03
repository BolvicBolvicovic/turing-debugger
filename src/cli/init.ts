export function getTMPath(): string {
  const tmPath = process.argv.filter((_, i) => i > 2).join(' ');

  if (!tmPath) {
    throw new Error(`Turing machine path is not specified!\nTuring machine's path: ${tmPath}`);
  }

  return tmPath;
}
