function displayFiberTree(fiberTree: any): void {
  console.log("📋 Displaying fiber tree in popup");
  const outputElement = document.getElementById("output");
  if (outputElement) {
    if (fiberTree) {
      outputElement.textContent = JSON.stringify(fiberTree, null, 2);
      console.log("✨ Fiber tree displayed successfully");
    } else {
      outputElement.textContent = "No React fiber data available. Make sure you're on a React page and the app is running.";
    }
  } else {
    console.error("❌ Output element not found");
  }
}

function requestFiberData(): void {
  console.log("🔍 Requesting latest fiber data from background");
  const message = { type: "GET_FIBER_DATA" };
  
  chrome.runtime.sendMessage(message, (response: any) => {
    if (response && response.type === "FIBER_DATA") {
      displayFiberTree(response.fiberTree);
    } else {
      displayFiberTree(null);
    }
  });
}

document.addEventListener('DOMContentLoaded', (): void => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", (): void => {
      console.log("🔄 Analyze button clicked");
      requestFiberData();
    });
  }
  
  // Request initial data when popup opens
  requestFiberData();
});