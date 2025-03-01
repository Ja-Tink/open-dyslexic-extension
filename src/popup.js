document.addEventListener("DOMContentLoaded", () => {
    const actionButton = document.getElementById("action-button");
    const addButton = document.getElementById("increase");
    const subtractButton = document.getElementById("decrease");

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

    //user toggles FONT switch:
    actionButton.addEventListener("change", () => {
        console.log("switch flipped");

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            
            chrome.runtime.sendMessage({
                action: "flip",
                tabId: tabs[0].id, //send tabid and url via the message
                url: tabs[0].url   
            });
        });
    });

    addButton.addEventListener("click", () => {
        const root = document.documentElement;
        // this is NOT accessing the fontsize the way I want.
        const fontSize = getComputedStyle(root).getPropertyValue("--font-size-var");
        console.log("Old font size:", fontSize);

    });

    subtractButton.addEventListener("click", () => {

    });




});

