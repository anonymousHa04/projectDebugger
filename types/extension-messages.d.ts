// Type definitions for Chrome extension messages
export interface FiberDataMessage {
  type: 'FIBER_DATA';
  payload?: any;
  fiberTree?: any;
}

export type ExtensionMessage = FiberDataMessage;