// content.js
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Stop the link from following
      // Perform your custom action here
      // reset CSS
    chrome.scripting.removeCSS({
        files: ["open_dyslexic.css"],
        target: { tabId: tab.id },
    });
    chrome.scripting.removeCSS({
    files: ["open_dyslexic.css"],
    target: { tabId: tab.id },
    });

    //reset badge action
    chrome.action.setBadgeText({ text: 'OFF' });

    // Then navigate to the new page
    window.location.href = event.target.href;

    //just to be safe
    chrome.action.setBadgeText({ text: 'OFF' });
  
    // Then navigate to the new page
    window.location.href = event.target.href;
    });
  });