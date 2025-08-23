// Type definitions for React Fiber internals
export interface ReactFiber {
  type: any;
  key: string | null;
  child: ReactFiber | null;
  sibling: ReactFiber | null;
  return: ReactFiber | null;
  memoizedProps: any;
  memoizedState: any;
  stateNode: any;
  elementType: any;
  tag: number;
}

export interface ReactFiberRoot {
  current: ReactFiber;
  containerInfo: any;
  pendingTime: number;
  finishedWork: ReactFiber | null;
}

export interface ReactDevToolsGlobalHook {
  onCommitFiberRoot?: (id: number, root: ReactFiberRoot, priorityLevel?: any) => void;
  onCommitFiberUnmount?: (id: number, fiber: ReactFiber) => void;
  supportsFiber: boolean;
  inject: (renderer: any) => number;
}

export interface FiberTreeData {
  type: string | null;
  key: string | null;
  props: any;
  state: any;
  children: FiberTreeData[];
}

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: ReactDevToolsGlobalHook;
    __DEV__?: boolean;
  }
}