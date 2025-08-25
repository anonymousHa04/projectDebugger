/**
 * Messaging utilities for React Insight extension
 * Handles communication between injected script and content script
 */

/**
 * Sends fiber tree data to the content script via postMessage
 * @param fiberTree - The processed fiber tree data
 */
function sendFiberDataToContentScript(fiberTree: any): void {
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

/**
 * Creates a timeout promise for race conditions
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise that rejects after timeout
 */
function createTimeoutPromise(timeoutMs: number): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Traversal timeout")), timeoutMs);
    });
}

/**
 * Handles errors during fiber processing
 * @param error - The error that occurred
 * @param context - Additional context about where the error occurred
 */
function handleProcessingError(error: any, context: string = "fiber processing"): void {
    console.error(`❌ Error during ${context}:`, error);
    
    if (error.message === "Traversal timeout") {
        console.error("⏰ Fiber tree traversal timed out");
    }
}

/**
 * Logs processing completion statistics
 * @param totalNodes - Total number of nodes processed
 * @param startTime - Processing start time
 */
function logProcessingStats(totalNodes: number, startTime: number): void {
    const duration = Date.now() - startTime;
    console.log(`✅ Fiber tree traversal completed. Processed ${totalNodes} nodes in ${duration}ms.`);
}

// Export for use in injected script (will be inlined during build)
if (typeof window !== 'undefined') {
    (window as any).__REACT_INSIGHT_MESSAGING__ = {
        sendFiberDataToContentScript,
        createTimeoutPromise,
        handleProcessingError,
        logProcessingStats
    };
}