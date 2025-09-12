import { commands } from '../../client/commands.js';
import { BreakpointType } from '../types/breakpoints.type.js';

// TODO: find a better name for setBreakpoint
export async function setBreakpoint(
  breakpoint: BreakpointType,
  sending: boolean,
  states: string[],
  alphabet: string[]
): Promise<{ sent: boolean; message: string }> {
  if (breakpoint.state === '') {
    return { sent: false, message: 'State name cannot be empty.' };
  }

  if (!states.includes(breakpoint.state)) {
    return { sent: false, message: `State "${breakpoint.state}" does not exist.` };
  }

  if (breakpoint.read === '') {
    return { sent: false, message: 'Read symbol cannot be empty.' };
  }

  if (!alphabet.includes(breakpoint.read)) {
    return { sent: false, message: `Symbol "${breakpoint.read}" is not in the alphabet.` };
  }

  if (sending) {
    try {
      await commands.breakpointAdd(breakpoint);

      return {
        sent: true,
        message: `BP set at state "${breakpoint.state}" when reading "${breakpoint.read}"`,
      };
    } catch (error) {
      if (error instanceof Error) {
        return { sent: false, message: `Error: ${error.message}` };
      }

      return { sent: false, message: 'An unknown error occurred.' };
    }
  }

  return {
    sent: false,
    message: `Set breakpoint at state "${breakpoint.state}" when reading symbol "${breakpoint.read}"`,
  };
}

export async function removeBreakpoint(
  breakpoint: BreakpointType
): Promise<{ removed: boolean; message: string }> {
  try {
    await commands.breakpointRemove(breakpoint);
    return {
      removed: true,
      message: `BP removed at state "${breakpoint.state}" when reading "${breakpoint.read}"`,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { removed: false, message: `Error: ${error.message}` };
    }
    return { removed: false, message: 'An unknown error occurred.' };
  }
}
