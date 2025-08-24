// Store the latest fiber data for popup requests
let latestFiberData: any = null;

chrome.runtime.onMessage.addListener((
  message: any, 
  sender: chrome.runtime.MessageSender, 
  sendResponse: (response?: any) => void
): boolean => {
  
  if (message.type === "FIBER_DATA" && sender.tab) {
    // Store the latest fiber data instead of broadcasting
    latestFiberData = message.payload;
    console.log("📊 Background stored fiber data from tab:", sender.tab.id);
  } else if (message.type === "GET_FIBER_DATA") {
    // Popup is requesting the latest fiber data
    console.log("📤 Sending latest fiber data to popup");
    sendResponse({
      type: "FIBER_DATA",
      fiberTree: latestFiberData
    });
  }

  return true;
});