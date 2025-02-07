//when the options page is loaded this funtion will run:
document.addEventListener("DOMContentLoaded", async () => {
    console.log("in options page");

    const rememberSwitch = document.getElementById("rememberSwitch");
    const forgetSwitch = document.getElementById("forgetSwitch");

    chrome.storage.local.get("memoryMode", (result) => {
        const memoryMode = result.memoryMode;

        console.log("Options.js views memoryMode as:", memoryMode);

        //default to remember mode
        if ( memoryMode === "remember" ){
            rememberSwitch.checked = true
            forgetSwitch.checked = false
        } else{
            rememberSwitch.checked = false
            forgetSwitch.checked = true
        }
    });

    //ensuring mutual exclusivity when a toggle changes
    rememberSwitch.addEventListener("change", () => {
        if (rememberSwitch.checked) {
            forgetSwitch.checked = false;
            chrome.storage.local.set({memoryMode : "remember" });
        } else{
            forgetSwitch.checked = true;
            chrome.storage.local.set({memoryMode : "forget" });
        }
    });

    forgetSwitch.addEventListener("change", () => {
        if (forgetSwitch.checked) {
            rememberSwitch.checked = false;
            chrome.storage.local.set({memoryMode : "forget" });
        } else{
            rememberSwitch.checked = true;
            chrome.storage.local.set({memoryMode : "remember" });
        }
    });
});

//could make the mutually exclusive thing its own general function to save
//on repetition