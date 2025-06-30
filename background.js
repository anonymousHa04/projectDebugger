chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "FIBER_DATA" && sender.tab) {
        chrome.runtime.sendMessage({
            type: "FIBER_DATA",
            fiberTree: message.payload
        });
    }

    return true;
});