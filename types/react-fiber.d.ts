// Type definitions for React Fiber internals
export type ComponentType = string | Function | null;

export type SerializableValue = 
  | string 
  | number 
  | boolean 
  | null 
  | SerializableValue[] 
  | { [key: string]: SerializableValue };

export interface ReactFiber {
  type: ComponentType;
  key: string | null;
  child: ReactFiber | null;
  sibling: ReactFiber | null;
  return: ReactFiber | null;
  memoizedProps: Record<string, unknown> | null;
  memoizedState: unknown;
  stateNode: unknown;
  elementType: ComponentType;
  tag: number;
}

export interface ReactFiberRoot {
  current: ReactFiber;
  containerInfo: Element | Document;
  pendingTime: number;
  finishedWork: ReactFiber | null;
}

export interface ReactDevToolsGlobalHook {
  onCommitFiberRoot?: (id: number, root: ReactFiberRoot, priorityLevel?: unknown) => void;
  onCommitFiberUnmount?: (id: number, fiber: ReactFiber) => void;
  supportsFiber: boolean;
  inject: (renderer: unknown) => number;
}

export interface FiberTreeData {
  type: string;
  key: string | null;
  props: SerializableValue;
  state: SerializableValue;
  children: FiberTreeData[];
}

export interface FiberMessage {
  type: 'FIBER_DATA';
  fiberTree: FiberTreeData | null;
}

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: ReactDevToolsGlobalHook;
    __DEV__?: boolean;
  }
}