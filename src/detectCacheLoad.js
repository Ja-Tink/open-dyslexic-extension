//to detect if a page is loaded from cache
window.addEventListener("pageshow", async (event) => {
    if (event.persisted) {
        console.log("Page restored from cache (bfcache)!");

        //send message to background script saying tab was restored
        chrome.runtime.sendMessage({ action: "tabRestored", url: window.location.href });
    }
    //page NOT loaded from cache
    else {
        chrome.runtime.sendMessage({ action: "newTab", url: window.location.href });
    }
});