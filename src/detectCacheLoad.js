//to detect if a page is loaded from cache
window.addEventListener("pageshow", async (event) => {
    if (event.persisted) {
        console.log("Page restored from cache (bfcache)!");

        chrome.runtime.sendMessage({
            action: "tabRestored",
        });
    }
    //page NOT loaded from cache
    else {
        chrome.runtime.sendMessage({
            action: "newTab",
        });
    }
});