export interface Library {
  /**
   * Trims the specified character from both ends of the string.
   * @param str The string to trim.
   * @param char The character to trim from the string.
   * @returns The trimmed string.
   */
  trimChar(str: string, char: string): string;

  /**
   * Trims the specified character from the end of the string.
   * @param str The string to trim.
   * @param char The character to trim from the end of the string.
   * @returns The trimmed string.
   */
  trimCharEnd(str: string, char: string): string;
}
