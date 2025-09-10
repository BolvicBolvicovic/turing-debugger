export enum CurrentInput {
  STATE_NAME,
  READ_SYMBOL,
}

export type BreakpointType = {
  stateName: string;
  readSymbol: string;
};
