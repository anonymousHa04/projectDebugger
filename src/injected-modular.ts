/**
 * React Insight - Modular Injected Script
 * 
 * This script is injected into web pages to analyze React Fiber trees.
 * It's been modularized for better maintainability and readability.
 * 
 * The script will be compiled and all helper functions will be inlined
 * to create a single JavaScript file that can be injected into web pages.
 */

// Import all helper modules (these will be inlined during compilation)
import './helpers/serialization';
import './helpers/fiber-utils';
import './helpers/fiber-traversal';
import './helpers/messaging';
import './helpers/throttling';

// Declare global helper interfaces for TypeScript
declare const __REACT_INSIGHT_TRAVERSAL__: any;
declare const __REACT_INSIGHT_MESSAGING__: any;
declare const __REACT_INSIGHT_THROTTLING__: any;

(function (): void {
    console.log("🔌 React Insight injected script loaded (modular version)");
    
    // Initialize React DevTools hook
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    
    if (!hook) {
        console.warn("⚠️ React DevTools hook not found - React app may not be loaded yet");
        return;
    }
    
    console.log("✅ React DevTools hook found:", hook);
    
    if (window.__DEV__) {
        console.log("🛠️ Development mode detected");
    }

    // Initialize throttling manager
    const throttleManager = new __REACT_INSIGHT_THROTTLING__.ThrottleManager(100);

    /**
     * Main fiber root commit handler
     * Called whenever React commits a fiber root (renders/updates)
     */
    hook.onCommitFiberRoot = function (id: number, root: any): void {
        // Check if we should throttle this processing
        if (throttleManager.shouldThrottle()) {
            return; // Silent throttling to reduce log spam
        }
        
        console.log("🔍 React Fiber tree detected, processing...");
        throttleManager.startProcessing();
        
        // Process asynchronously to avoid blocking the main thread
        processRootAsync(root)
            .finally(() => {
                throttleManager.endProcessing();
            });
    };

    /**
     * Processes a React root asynchronously with timeout protection
     * @param root - The React fiber root to process
     */
    async function processRootAsync(root: any): Promise<void> {
        try {
            const startTime = Date.now();
            
            // Initialize traversal state
            const traversalState = new __REACT_INSIGHT_TRAVERSAL__.TraversalState();
            console.log("🔄 Starting fiber tree traversal...");
            
            // Create timeout promise (5 seconds)
            const timeoutPromise = __REACT_INSIGHT_MESSAGING__.createTimeoutPromise(5000);
            
            // Start traversal
            const traversalPromise = __REACT_INSIGHT_TRAVERSAL__.traverseFiberAsync(
                root.current, 
                traversalState
            );
            
            // Race between traversal and timeout
            const fiberTree = await Promise.race([traversalPromise, timeoutPromise]);
            
            // Log completion stats
            __REACT_INSIGHT_MESSAGING__.logProcessingStats(
                traversalState.totalProcessedNodes, 
                startTime
            );
            
            // Send data to content script
            __REACT_INSIGHT_MESSAGING__.sendFiberDataToContentScript(fiberTree);
            
        } catch (error) {
            __REACT_INSIGHT_MESSAGING__.handleProcessingError(error, "root processing");
        }
    }

    console.log("🚀 React Insight modular injected script initialized");
})();