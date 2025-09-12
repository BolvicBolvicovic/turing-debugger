export enum CurrentInput {
  STATE_NAME,
  READ_SYMBOL,
}

export type BreakpointType = {
  state: string;
  read: string;
};
