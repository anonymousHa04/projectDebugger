/**
 * React Fiber utility functions
 * Helper functions for working with React Fiber nodes
 */

/**
 * Extracts a readable component name from a fiber type
 * @param type - The fiber type (string, function, or other)
 * @returns Human-readable component name
 */
function getComponentName(type: any): string {
    if (typeof type === 'string') {
        return type;
    }
    
    if (typeof type === 'function') {
        return type.name || '[Component]';
    }
    
    return '[Unknown]';
}

/**
 * Checks if a fiber node represents a React component
 * @param fiber - The fiber node to check
 * @returns True if the fiber represents a component
 */
function isComponentFiber(fiber: any): boolean {
    if (!fiber || !fiber.type) {
        return false;
    }
    
    // Check for function components or class components
    return typeof fiber.type === 'function' || typeof fiber.type === 'string';
}

/**
 * Gets basic information about a fiber node for debugging
 * @param fiber - The fiber node to analyze
 * @returns Object with fiber information
 */
function getFiberInfo(fiber: any): any {
    if (!fiber) {
        return null;
    }
    
    return {
        type: getComponentName(fiber.type),
        hasChild: !!fiber.child,
        hasSibling: !!fiber.sibling,
        hasParent: !!fiber.return,
        tag: fiber.tag,
        key: fiber.key
    };
}

/**
 * Checks if a fiber node has circular references in its tree
 * @param fiber - The fiber node to check
 * @param visited - Set of already visited nodes
 * @returns True if circular reference detected
 */
function hasCircularReference(fiber: any, visited: Set<any>): boolean {
    if (!fiber) {
        return false;
    }
    
    return visited.has(fiber);
}

// Export for use in injected script (will be inlined during build)
if (typeof window !== 'undefined') {
    (window as any).__REACT_INSIGHT_FIBER_UTILS__ = {
        getComponentName,
        isComponentFiber,
        getFiberInfo,
        hasCircularReference
    };
}