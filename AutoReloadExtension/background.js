let intervals = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.action === 'start') {
                const tabId = request.tabId;
                const interval = request.interval * 1000;

                if (intervals[tabId]) {
                        clearInterval(intervals[tabId]);
                }

                intervals[tabId] = setInterval(function () {
                        chrome.tabs.reload(tabId);
                }, interval);
        } else if (request.action === 'stop') {
                const tabId = request.tabId;

                if (intervals[tabId]) {
                        clearInterval(intervals[tabId]);
                        delete intervals[tabId];
                }
        }
});
