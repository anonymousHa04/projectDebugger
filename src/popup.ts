import type { ExtensionMessage } from '../types/extension-messages';

chrome.runtime.onMessage.addListener((message: ExtensionMessage): void => {
  if (message.type === "FIBER_DATA") {
    const fiberTree = message.fiberTree;
    const outputElement = document.getElementById("output");
    if (outputElement) {
      outputElement.textContent = JSON.stringify(fiberTree, null, 2);
    }
  }
});

document.addEventListener('DOMContentLoaded', (): void => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", (): void => {
      // In current setup, fiber data comes via background automatically
      // console.log("buttonClicked")
    });
  }
});