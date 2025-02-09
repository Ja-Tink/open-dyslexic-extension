document.addEventListener("DOMContentLoaded", () => {
    const actionButton = document.getElementById("action-button");

    // Load stored switch state
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {  
        const tabId = tabs[0].id // Manually attach the tab ID
        const url = tabs[0].url   // Send the tab URL
        const storageKey = `tab-${tabId}-url-${url}`;

        chrome.storage.local.get(storageKey, (result) => {
            const state = result[storageKey] !== undefined ? result[storageKey] : false;
            
            actionButton.checked = state;
        });
    });

    console.log("in popup");
    console.log("Action button found?", actionButton);

    //user toggles switch:
    actionButton.addEventListener("change", () => {
        console.log("switch flipped");

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            
            chrome.runtime.sendMessage({
                action: "flip",
                tabId: tabs[0].id, // Manually attach the tab ID
                url: tabs[0].url   // Send the tab URL
            });
        });
    });


});

