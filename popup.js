chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "FIBER_DATA") {
    const fiberTree = message.payload;
    document.getElementById("output").textContent = JSON.stringify(fiberTree, null, 2);
  }
});

document.getElementById("analyzeBtn").addEventListener("click", () => {
  // In current setup, fiber data comes via background automatically
  // console.log("buttonClicked")
});