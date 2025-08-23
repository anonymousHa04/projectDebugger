chrome.runtime.onMessage.addListener((
  message: any, 
  sender: chrome.runtime.MessageSender, 
  sendResponse: (response?: any) => void
): boolean => {
  if (message.type === "FIBER_DATA" && sender.tab) {
    chrome.runtime.sendMessage({
      type: "FIBER_DATA",
      fiberTree: message.payload
    });
  }

  return true;
});