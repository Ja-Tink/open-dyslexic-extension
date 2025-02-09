document.addEventListener("DOMContentLoaded", () => {
    const actionButton = document.getElementById("action-button");

    //this is all bad- I need to bind the switch state to the tab's stored state, not its own thing. Come on jack, THINK

    // Load stored switch state
    chrome.storage.local.get("fontActive", (state) => {
        if (state.switchState !== undefined) {
            actionButton.checked = data.switchState;
        }
    });

    //user toggles switch:
    actionButton.addEventListener("change", () => {
        console.log("switch flipped");
        //save new state
        chrome.storage.local.set({ "fontActive": actionButton.checked });

        //chrome.runtime.sendMessage({ action: "flip", url: window.location.href });
    });
});