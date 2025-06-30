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
