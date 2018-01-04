
chrome.webRequest.onCompleted.addListener(
    function(details) {
        chrome.tabs.query({ active: true }, function(tabs) {
            chrome.tabs.sendMessage( tabs[0].id, {operate: "et-tableLoadCompleted"} );
        });
    },
    {
        urls: [
            "*://*/../"
        ]
    }
);

chrome.webRequest.onCompleted.addListener(
    function(details) {
        chrome.tabs.query({ active: true }, function(tabs) {
            chrome.tabs.sendMessage( tabs[0].id, {operate: "et-visualDetail"} );
        });
    },
    {
        urls: [
            "*://*/../"
        ]
    }
);

chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install"){

    }else if(details.reason == "update"){

    }
});

var reloadWebPage = function(){
    chrome.tabs.query({ active: true }, function(tabs) {
        chrome.tabs.sendMessage( tabs[0].id, {operate: "et-reloadPage"} );
    });
}