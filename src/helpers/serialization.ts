/**
 * Safe serialization utilities for React Fiber data
 * Prevents infinite loops and performance issues when serializing complex objects
 */

/**
 * Safely serializes data with depth limiting to prevent performance issues
 * @param obj - The object to serialize
 * @param depth - Current serialization depth
 * @param maxDepth - Maximum allowed depth
 * @returns Serialized representation of the object
 */
function safeSerialize(obj: any, depth: number = 0, maxDepth: number = 3): any {
    // Prevent deep serialization that could cause performance issues
    if (depth > maxDepth) {
        return '[Max Depth Reached]';
    }
    
    if (obj === null || obj === undefined) {
        return null;
    }
    
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return obj;
    }
    
    if (typeof obj === 'function') {
        return '[Function]';
    }
    
    if (typeof obj === 'symbol') {
        return '[Symbol]';
    }
    
    if (Array.isArray(obj)) {
        return serializeArray(obj, depth, maxDepth);
    }
    
    if (typeof obj === 'object' && obj !== null) {
        return serializeObject(obj, depth, maxDepth);
    }
    
    return '[Unknown]';
}

/**
 * Serializes arrays with size limitations
 * @param arr - Array to serialize
 * @param depth - Current serialization depth
 * @param maxDepth - Maximum allowed depth
 * @returns Serialized array
 */
function serializeArray(arr: any[], depth: number, maxDepth: number): any[] {
    const serializedArray: any[] = [];
    const maxItems = Math.min(arr.length, 5); // Limit array size
    
    for (let i = 0; i < maxItems; i++) {
        serializedArray.push(safeSerialize(arr[i], depth + 1, maxDepth));
    }
    
    if (arr.length > maxItems) {
        serializedArray.push(`[... ${arr.length - maxItems} more items]`);
    }
    
    return serializedArray;
}

/**
 * Serializes objects with property limitations and React internal filtering
 * @param obj - Object to serialize
 * @param depth - Current serialization depth
 * @param maxDepth - Maximum allowed depth
 * @returns Serialized object
 */
function serializeObject(obj: any, depth: number, maxDepth: number): any {
    const result: any = {};
    let count = 0;
    const maxProperties = 10; // Limit number of properties
    
    // Skip React internal properties that might cause issues
    const skipKeys = ['_owner', '_store', '_source', '_self', '$$typeof', '_debugOwner', '_debugSource'];
    
    for (const key in obj) {
        if (count >= maxProperties) break;
        
        if (Object.prototype.hasOwnProperty.call(obj, key) && 
            !skipKeys.includes(key) &&
            !key.startsWith('__react')) {
            try {
                const value = obj[key];
                result[key] = safeSerialize(value, depth + 1, maxDepth);
            } catch (e) {
                result[key] = '[Unserializable]';
            }
        }
        count++;
    }
    
    // Show if there are more properties
    const totalKeys = Object.keys(obj).length;
    if (totalKeys > count) {
        result['[...]'] = `${totalKeys - count} more properties`;
    }
    
    return result;
}

// Export for use in injected script (will be inlined during build)
if (typeof window !== 'undefined') {
    (window as any).__REACT_INSIGHT_SERIALIZATION__ = {
        safeSerialize
    };
}