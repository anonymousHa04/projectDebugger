/**
 * React Insight - Clean Modular Injected Script
 * 
 * This script analyzes React Fiber trees and is organized into clear sections
 * for better readability and maintainability.
 */

// Type assertions for React globals

(function () {
    console.log("🔌 React Insight injected script loaded");

    // ============================================================================
    // INITIALIZATION & SETUP
    // ============================================================================
    
    const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    
    if (!hook) {
        console.warn("⚠️ React DevTools hook not found - React app may not be loaded yet");
        return;
    }
    
    console.log("✅ React DevTools hook found:", hook);
    
    if ((window as any).__DEV__) {
        console.log("🛠️ Development mode detected");
    }

    // ============================================================================
    // THROTTLING & PROCESSING STATE
    // ============================================================================
    
    let isProcessing = false;
    let lastProcessTime = 0;
    const THROTTLE_DELAY = 100; // ms

    // ============================================================================
    // TRAVERSAL STATE & CONFIGURATION
    // ============================================================================
    
    let visitedFibers = new Set();
    let totalProcessedNodes = 0;
    const MAX_TOTAL_NODES = 500; // Global limit to prevent excessive processing

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    /**
     * Extracts a readable component name from a fiber type
     */
    function getComponentName(type) {
        if (typeof type === 'string') {
            return type;
        }
        
        if (typeof type === 'function') {
            return type.name || '[Component]';
        }
        
        return '[Unknown]';
    }

    /**
     * Creates a timeout promise for race conditions
     */
    function createTimeoutPromise(timeoutMs) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Traversal timeout")), timeoutMs);
        });
    }

    /**
     * Sends fiber tree data to the content script
     */
    function sendFiberDataToContentScript(fiberTree) {
        const origin = location.hostname === "localhost"
            ? `${location.protocol}//${location.hostname}:${location.port}`
            : "*";
        
        const messageData = { type: "FIBER_DATA", fiberTree };
        
        try {
            window.postMessage(messageData, origin);
            console.log("✅ Fiber data sent to content script");
        } catch (error) {
            console.error("❌ Failed to post message:", error);
        }
    }

    // ============================================================================
    // SERIALIZATION FUNCTIONS
    // ============================================================================

    /**
     * Safely serializes data with depth limiting to prevent performance issues
     */
    function safeSerialize(obj, depth = 0, maxDepth = 3) {
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
     */
    function serializeArray(arr, depth, maxDepth) {
        const serializedArray = [];
        const maxItems = Math.min(arr.length, 5); // Further reduced array size
        
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
     */
    function serializeObject(obj, depth, maxDepth) {
        const result = {};
        let count = 0;
        const maxProperties = 10; // Reduced from 20
        
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

    // ============================================================================
    // FIBER TRAVERSAL FUNCTIONS
    // ============================================================================

    /**
     * Asynchronously traverses a React Fiber tree with safety protections
     */
    async function traverseFiberAsync(
        fiber, 
        depth = 0, 
        maxDepth = 20 // Reduced from 50
    ) {
        // Safety checks
        if (!fiber || depth > maxDepth || totalProcessedNodes > MAX_TOTAL_NODES) {
            if (totalProcessedNodes > MAX_TOTAL_NODES) {
                console.warn("⚠️ Reached maximum node limit, stopping traversal");
            }
            return null;
        }

        // Prevent infinite loops with circular references
        if (visitedFibers.has(fiber)) {
            console.warn("⚠️ Circular reference detected, skipping fiber");
            return {
                type: '[Circular Reference]',
                key: fiber.key,
                props: null,
                state: null,
                children: []
            };
        }

        visitedFibers.add(fiber);
        totalProcessedNodes++;

        // Yield control more frequently to prevent blocking
        if (depth % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 1));
        }

        const fiberType = getComponentName(fiber.type);
        console.log(`Processing fiber at depth ${depth}, type: ${fiberType}, total nodes: ${totalProcessedNodes}`);
        
        // Add more detailed logging for debugging
        if (depth === 0) {
            console.log('Root fiber details:', {
                type: fiberType,
                hasChild: !!fiber.child,
                hasSibling: !!fiber.sibling,
                tag: fiber.tag
            });
        }

        console.log(`About to serialize props for ${fiberType}...`);
        // Temporarily disable serialization to test if it's causing the hang
        const serializedProps = null; // safeSerialize(fiber.memoizedProps);
        console.log(`Props serialized for ${fiberType}`);
        
        console.log(`About to serialize state for ${fiberType}...`);
        const serializedState = null; // safeSerialize(fiber.memoizedState);
        console.log(`State serialized for ${fiberType}`);

        const data = {
            type: getComponentName(fiber.type),
            key: fiber.key,
            props: serializedProps,
            state: serializedState,
            children: []
        };

        // Process children asynchronously with stricter limits
        let child = fiber.child;
        let childCount = 0;
        const maxChildren = 20; // Reduced from 100
        
        while (child && childCount < maxChildren && totalProcessedNodes < MAX_TOTAL_NODES) {
            try {
                const childData = await traverseFiberAsync(child, depth + 1, maxDepth);
                if (childData) {
                    data.children.push(childData);
                }
            } catch (error) {
                console.warn("Error processing child fiber:", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                const errorData = {
                    type: '[Error]',
                    key: null,
                    props: { error: errorMessage },
                    state: null,
                    children: []
                };
                
                data.children.push(errorData);
                break; // Stop processing siblings if we hit an error
            }
            child = child.sibling;
            childCount++;
        }

        return data;
    }

    /**
     * Synchronous fiber traversal (fallback/legacy)
     */
    function traverseFiberSync(fiber) {
        if (!fiber) {
            return null;
        }

        const data = {
            type: getComponentName(fiber.type),
            key: fiber.key,
            props: safeSerialize(fiber.memoizedProps),
            state: safeSerialize(fiber.memoizedState),
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

    // ============================================================================
    // MAIN PROCESSING LOGIC
    // ============================================================================

    /**
     * Processes a React root asynchronously with timeout protection
     */
    async function processRootAsync(root) {
        try {
            const startTime = Date.now();
            
            // Reset tracking for each new traversal
            visitedFibers = new Set();
            totalProcessedNodes = 0;
            console.log("🔄 Starting fiber tree traversal...");
            
            // Add timeout to prevent infinite processing
            const timeoutPromise = createTimeoutPromise(5000); // 5 second timeout
            
            const traversalPromise = traverseFiberAsync(root.current);
            
            const fiberTree = await Promise.race([traversalPromise, timeoutPromise]);
            
            console.log(`✅ Fiber tree traversal completed. Processed ${totalProcessedNodes} nodes.`);
            
            // Send data to content script
            sendFiberDataToContentScript(fiberTree);
            
        } catch (error) {
            console.error("❌ Error processing fiber tree:", error);
            if (error.message === "Traversal timeout") {
                console.error("⏰ Fiber tree traversal timed out after 5 seconds");
            }
        }
    }

    // ============================================================================
    // REACT DEVTOOLS HOOK SETUP
    // ============================================================================

    /**
     * Main fiber root commit handler
     * Called whenever React commits a fiber root (renders/updates)
     */
    hook.onCommitFiberRoot = function (id, root) {
        // Throttle to prevent excessive processing
        const now = Date.now();
        if (isProcessing || (now - lastProcessTime) < THROTTLE_DELAY) {
            return; // Silent throttling to reduce log spam
        }
        
        console.log("🔍 React Fiber tree detected, processing...");
        isProcessing = true;
        lastProcessTime = now;
        
        // Process asynchronously to avoid blocking the main thread
        processRootAsync(root)
            .finally(() => {
                isProcessing = false;
            });
    };

    console.log("🚀 React Insight clean injected script initialized");
})();