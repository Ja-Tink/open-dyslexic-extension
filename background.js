//installation confirmation
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension insalled");
  });

chrome.action.onClicked.addListener(async (tab) => {
    //get id of current tab and current url
    const tabId = tab.id
    const url = tab.url
    const storageKey = `tab-${tabId}-url-${url}`;
    //access the current state of tab
    const result = await chrome.storage.local.get(storageKey);
    prevState = result[storageKey]; // OR FALSE
    //if no state is set, then this is our first time accessing the tab
    //and it must be false
    if (prevState === undefined){
      prevState = false;
      await chrome.storage.local.set({ [`tab-${tabId}`]: prevState });
    }

    //debugging check
    console.log("prevState:", prevState);

    // Next state will always be the opposite
    const nextState = !prevState //=== true ? false : true;

    if (nextState === true) {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: ["open_dyslexic.css"],
        target: { tabId: tab.id },
      });
      //set remembered state to nextState
      await chrome.storage.local.set({ [storageKey]: nextState });
    } else if (nextState === false) {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ["open_dyslexic.css"],
        target: { tabId: tab.id },
      });
      //set remembered state to nextState
      await chrome.storage.local.set({ [storageKey]: nextState });
      chrome.tabs.reload();
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //get id of current tab and current url
  const tabId = sender.tab.id
  const url = sender.tab.url
  const storageKey = `tab-${tabId}-url-${url}`;

  //if page was cached, keep flag the same
  if (message.action === "tabRestored") {
    console.log("Page loaded from cache");
  //if page was NOT cached, then it was reloaded- set flag to false
  } else {
    console.log("Page loaded from server");
    chrome.storage.local.set({ [storageKey]: false });
  }
});

