/**
 * Throttling utilities for React Insight extension
 * Prevents excessive processing and UI blocking
 */

/**
 * Throttling state manager
 */
class ThrottleManager {
    private isProcessing: boolean = false;
    private lastProcessTime: number = 0;
    private readonly throttleDelay: number;

    constructor(throttleDelay: number = 100) {
        this.throttleDelay = throttleDelay;
    }

    /**
     * Checks if processing should be throttled
     * @returns True if processing should be skipped
     */
    shouldThrottle(): boolean {
        const now = Date.now();
        return this.isProcessing || (now - this.lastProcessTime) < this.throttleDelay;
    }

    /**
     * Starts a processing session
     */
    startProcessing(): void {
        this.isProcessing = true;
        this.lastProcessTime = Date.now();
    }

    /**
     * Ends a processing session
     */
    endProcessing(): void {
        this.isProcessing = false;
    }

    /**
     * Gets current processing state
     * @returns True if currently processing
     */
    isCurrentlyProcessing(): boolean {
        return this.isProcessing;
    }

    /**
     * Gets time since last processing
     * @returns Milliseconds since last processing
     */
    getTimeSinceLastProcess(): number {
        return Date.now() - this.lastProcessTime;
    }
}

/**
 * Creates a debounced version of a function
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
function debounce<T extends (...args: any[]) => any>(
    func: T, 
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: any;
    
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Creates a throttled version of a function
 * @param func - Function to throttle
 * @param delay - Minimum delay between calls
 * @returns Throttled function
 */
function throttle<T extends (...args: any[]) => any>(
    func: T, 
    delay: number
): (...args: Parameters<T>) => void {
    let lastCall = 0;
    
    return (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
}

// Export for use in injected script (will be inlined during build)
if (typeof window !== 'undefined') {
    (window as any).__REACT_INSIGHT_THROTTLING__ = {
        ThrottleManager,
        debounce,
        throttle
    };
}