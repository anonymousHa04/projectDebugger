// Type definitions for Chrome extension messages
import type { FiberTreeData } from './react-fiber';

export interface FiberDataMessage {
  type: 'FIBER_DATA';
  payload: FiberTreeData | null;
}

export interface FiberDataResponse {
  type: 'FIBER_DATA';
  fiberTree: FiberTreeData | null;
}

export interface GetFiberDataMessage {
  type: 'GET_FIBER_DATA';
}

export type ExtensionMessage = FiberDataMessage | GetFiberDataMessage;
export type ExtensionResponse = FiberDataResponse;