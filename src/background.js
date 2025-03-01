//TODO: modify functionality based on toggled setting

//installation confirmation
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
    chrome.storage.local.set({ "memoryMode": "remember"});

  });

async function fontSwap(sent_tabId, sent_url) {
    //get id of current tab and current url
    const tabId = sent_tabId
    const url = sent_url
    const storageKey = `tab-${tabId}-url-${url}`;
    //access the current state of tab
    const result = await chrome.storage.local.get(storageKey);
    let prevState = result[storageKey]; // OR FALSE
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
      console.log("Inserting CSS");
      await chrome.scripting.insertCSS({
        files: ["static/open_dyslexic.css"],
        target: { tabId: tabId },
      });
      //set remembered state to nextState
      await chrome.storage.local.set({ [storageKey]: nextState });
    } else if (nextState === false) {
      // Remove the CSS file when the user turns the extension off
      console.log("Removing CSS");
      await chrome.scripting.removeCSS({
        files: ["static/open_dyslexic.css"],
        target: { tabId: tabId },
      });
      //reload and set remembered state to nextState
      await chrome.storage.local.set({ [storageKey]: nextState });
      chrome.tabs.reload();
    }
};


async function cacheLoad(message, sender){
  //get id of current tab and current url
  const tabId = sender.tab.id
  const url = sender.url
  const storageKey = `tab-${tabId}-url-${url}`;

  chrome.storage.local.get("memoryMode", (memoryMode) => {
    console.log("memoryMode in background:", memoryMode.memoryMode);

    if (memoryMode.memoryMode === "remember"){
      //if page was cached, keep flag the same
      if (message.action === "tabRestored") {
        console.log("Page loaded from cache");
      //if page was NOT cached, then it was reloaded- 
      //need to check flag and apply CSS if necessary
      } else {
        console.log("Page loaded from server");
        let prevState = undefined;
        chrome.storage.local.get(storageKey, (result) => {
          prevState = result[storageKey] || false;
        
          console.log("Previous state of loaded page:", prevState);
          if (prevState === true) {
            console.log("Page was previously loaded with font. Reinstering CSS.");
            chrome.scripting.insertCSS({
              files: ["static/open_dyslexic.css"],
              target: { tabId: sender.tab.id },
            });
          } else{
            console.log("Page was previously loaded without font. Removing CSS.");
            chrome.scripting.removeCSS({
              files: ["static/open_dyslexic.css"],
              target: { tabId: sender.tab.id },
            });
          }
        });
      }
    } else{ //memoryMode is set to FORGET
      //remove CSS (if it exists)
      chrome.scripting.removeCSS({
        files: ["static/open_dyslexic.css"],
        target: { tabId: sender.tab.id }});
      //set this tab's state to off
      chrome.storage.local.set({ [storageKey]: false });

    }
  });

}

//listen for flip message or load message
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "flip") {
    fontSwap(message.tabId, message.url);
  }
  else{
    cacheLoad(message, sender);
  }
});

