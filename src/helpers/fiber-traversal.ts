/**
 * React Fiber tree traversal utilities
 * Handles safe traversal of React Fiber trees with protection against infinite loops
 */

// Import helper functions (will be inlined during build)
declare const __REACT_INSIGHT_SERIALIZATION__: any;
declare const __REACT_INSIGHT_FIBER_UTILS__: any;

/**
 * Configuration for fiber traversal
 */
interface TraversalConfig {
    maxDepth: number;
    maxChildren: number;
    maxTotalNodes: number;
    yieldInterval: number;
    yieldDelay: number;
}

/**
 * Default traversal configuration
 */
const DEFAULT_CONFIG: TraversalConfig = {
    maxDepth: 20,
    maxChildren: 20,
    maxTotalNodes: 500,
    yieldInterval: 5,
    yieldDelay: 1
};

/**
 * Traversal state to track progress and prevent infinite loops
 */
class TraversalState {
    visitedFibers: Set<any> = new Set();
    totalProcessedNodes: number = 0;
    config: TraversalConfig;

    constructor(config: TraversalConfig = DEFAULT_CONFIG) {
        this.config = config;
    }

    reset(): void {
        this.visitedFibers = new Set();
        this.totalProcessedNodes = 0;
    }

    shouldStop(depth: number): boolean {
        return depth > this.config.maxDepth || 
               this.totalProcessedNodes > this.config.maxTotalNodes;
    }

    shouldYield(depth: number): boolean {
        return depth % this.config.yieldInterval === 0;
    }

    markVisited(fiber: any): void {
        this.visitedFibers.add(fiber);
        this.totalProcessedNodes++;
    }

    isVisited(fiber: any): boolean {
        return this.visitedFibers.has(fiber);
    }
}

/**
 * Asynchronously traverses a React Fiber tree with safety protections
 * @param fiber - The root fiber node to traverse
 * @param state - Traversal state object
 * @param depth - Current traversal depth
 * @returns Promise resolving to fiber tree data
 */
async function traverseFiberAsync(
    fiber: any, 
    state: TraversalState,
    depth: number = 0
): Promise<any> {
    // Safety checks
    if (!fiber || state.shouldStop(depth)) {
        if (state.totalProcessedNodes > state.config.maxTotalNodes) {
            console.warn("⚠️ Reached maximum node limit, stopping traversal");
        }
        return null;
    }

    // Prevent infinite loops with circular references
    if (state.isVisited(fiber)) {
        console.warn("⚠️ Circular reference detected, skipping fiber");
        return createCircularReferenceNode(fiber);
    }

    state.markVisited(fiber);

    // Yield control to prevent blocking
    if (state.shouldYield(depth)) {
        await new Promise(resolve => setTimeout(resolve, state.config.yieldDelay));
    }

    const fiberType = __REACT_INSIGHT_FIBER_UTILS__.getComponentName(fiber.type);
    console.log(`Processing fiber at depth ${depth}, type: ${fiberType}, total nodes: ${state.totalProcessedNodes}`);
    
    // Add detailed logging for root fiber
    if (depth === 0) {
        console.log('Root fiber details:', __REACT_INSIGHT_FIBER_UTILS__.getFiberInfo(fiber));
    }

    // Create fiber data node
    const data = await createFiberDataNode(fiber, fiberType);

    // Process children
    await processChildren(fiber, data, state, depth);

    return data;
}

/**
 * Creates a fiber data node with serialized props and state
 * @param fiber - The fiber node
 * @param fiberType - The component type name
 * @returns Fiber data object
 */
async function createFiberDataNode(fiber: any, fiberType: string): Promise<any> {
    console.log(`About to serialize props for ${fiberType}...`);
    // Temporarily disable serialization to test if it's causing the hang
    const serializedProps = null; // __REACT_INSIGHT_SERIALIZATION__.safeSerialize(fiber.memoizedProps);
    console.log(`Props serialized for ${fiberType}`);
    
    console.log(`About to serialize state for ${fiberType}...`);
    const serializedState = null; // __REACT_INSIGHT_SERIALIZATION__.safeSerialize(fiber.memoizedState);
    console.log(`State serialized for ${fiberType}`);

    return {
        type: fiberType,
        key: fiber.key,
        props: serializedProps,
        state: serializedState,
        children: []
    };
}

/**
 * Processes child fibers asynchronously
 * @param fiber - Parent fiber node
 * @param data - Parent data object to add children to
 * @param state - Traversal state
 * @param depth - Current depth
 */
async function processChildren(
    fiber: any, 
    data: any, 
    state: TraversalState, 
    depth: number
): Promise<void> {
    let child = fiber.child;
    let childCount = 0;
    
    while (child && 
           childCount < state.config.maxChildren && 
           state.totalProcessedNodes < state.config.maxTotalNodes) {
        try {
            const childData = await traverseFiberAsync(child, state, depth + 1);
            if (childData) {
                data.children.push(childData);
            }
        } catch (error) {
            console.warn("Error processing child fiber:", error);
            data.children.push(createErrorNode(error));
            break; // Stop processing siblings if we hit an error
        }
        child = child.sibling;
        childCount++;
    }
}

/**
 * Creates a circular reference placeholder node
 * @param fiber - The fiber that caused the circular reference
 * @returns Circular reference node
 */
function createCircularReferenceNode(fiber: any): any {
    return {
        type: '[Circular Reference]',
        key: fiber.key,
        props: null,
        state: null,
        children: []
    };
}

/**
 * Creates an error node for traversal errors
 * @param error - The error that occurred
 * @returns Error node
 */
function createErrorNode(error: any): any {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
        type: '[Error]',
        key: null,
        props: { error: errorMessage },
        state: null,
        children: []
    };
}

/**
 * Synchronous fiber traversal (fallback/legacy)
 * @param fiber - The fiber node to traverse
 * @returns Fiber tree data
 */
function traverseFiberSync(fiber: any): any {
    if (!fiber) {
        return null;
    }

    const data = {
        type: __REACT_INSIGHT_FIBER_UTILS__.getComponentName(fiber.type),
        key: fiber.key,
        props: __REACT_INSIGHT_SERIALIZATION__.safeSerialize(fiber.memoizedProps),
        state: __REACT_INSIGHT_SERIALIZATION__.safeSerialize(fiber.memoizedState),
        children: []
    };

    let child = fiber.child;
    while (child) {
        const childData = traverseFiberSync(child);
        if (childData) {
            data.children.push(childData);
        }
        child = child.sibling;
    }

    return data;
}

// Export for use in injected script (will be inlined during build)
if (typeof window !== 'undefined') {
    (window as any).__REACT_INSIGHT_TRAVERSAL__ = {
        TraversalState,
        traverseFiberAsync,
        traverseFiberSync,
        DEFAULT_CONFIG
    };
}