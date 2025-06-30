/**
 * Injects a script file from the Chrome extension into the current webpage.
 * 
 * Dynamically creates a script element with its source set to the specified file within the extension, appends it to the document, and removes the script element after it loads. If the document is not ready, waits for the DOMContentLoaded event before injecting.
 * 
 * @param {string} filePath - The path to the script file within the Chrome extension.
 */
function injectScript(filePath) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL(filePath);
  script.onload = function () {
    this.remove();
  };
  
  const target = document.head || document.documentElement;
  if (target) {
    target.appendChild(script);
  } else {
    // fallback or delay append until DOM is ready
    document.addEventListener("DOMContentLoaded", () => {
      const fallbackTarget = document.head || document.documentElement;
      if (fallbackTarget) {
        fallbackTarget.appendChild(script);
      }
    });
  }
}

injectScript("injected.js");
