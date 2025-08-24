/**
 * Injects a script file from the Chrome extension into the current webpage.
 * 
 * Dynamically creates a script element with its source set to the specified file within the extension, 
 * appends it to the document, and removes the script element after it loads. If the document is not ready, 
 * waits for the DOMContentLoaded event before injecting.
 * 
 * @param filePath - The path to the script file within the Chrome extension.
 */
function injectScript(filePath: string): void {
  console.log("🚀 Injecting React Insight script into page:", filePath);
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(filePath);
  console.log("📍 Script URL:", script.src);
  
  script.onload = function (): void {
    console.log("✅ React Insight script loaded successfully");
    script.remove();
  };
  
  script.onerror = function (error): void {
    console.error("❌ Failed to load React Insight script:", error);
    console.error("❌ Script src was:", script.src);
  };
  
  const target = document.head || document.documentElement;
  if (target) {
    target.appendChild(script);
  } else {
    // fallback or delay append until DOM is ready
    document.addEventListener("DOMContentLoaded", (): void => {
      const fallbackTarget = document.head || document.documentElement;
      if (fallbackTarget) {
        fallbackTarget.appendChild(script);
      }
    });
  }
}

// Listen for messages from the injected script
window.addEventListener("message", (event: MessageEvent): void => {
  // Only process messages from the same origin and with our specific type
  if (event.source !== window || !event.data || event.data.type !== "FIBER_DATA") {
    return;
  }
  
  console.log("📨 Content script received FIBER_DATA message");
  
  try {
    const message = {
      type: "FIBER_DATA",
      payload: event.data.fiberTree
    };
    
    chrome.runtime.sendMessage(message);
    console.log("✅ Fiber data forwarded to background script");
  } catch (error) {
    console.error("❌ Failed to send message to background:", error);
  }
});

console.log("🎯 Content script loaded, injecting React Insight...");
injectScript("dist/injected.js");