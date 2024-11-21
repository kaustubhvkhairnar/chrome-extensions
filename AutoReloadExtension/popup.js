let timerInterval;
let isRunning = false;

document.getElementById('toggle').addEventListener('click', function () {
        const button = document.getElementById('toggle');
        const timeValue = parseInt(document.getElementById('time-value').value) || 5;

        if (timeValue < 5) {
                alert("Time must be 5 seconds or more!");
                return;
        }

        if (isRunning) {
                // Stop the timer
                clearInterval(timerInterval);
                chrome.action.setBadgeText({ text: '' }); // Clear badge text

                // Notify the background script to stop
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        const tabId = tabs[0].id;
                        chrome.runtime.sendMessage({ action: 'stop', tabId });
                });

                // Update UI
                button.textContent = 'Start';
                button.classList.remove('stop');
                isRunning = false;
        } else {
                // Start the timer
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        const tabId = tabs[0].id;

                        let remainingTime = timeValue;
                        chrome.action.setBadgeText({ text: remainingTime.toString() });

                        timerInterval = setInterval(() => {
                                remainingTime--;
                                chrome.action.setBadgeText({ text: remainingTime.toString() });

                                if (remainingTime <= 0) {
                                        chrome.tabs.reload(tabId); // Reload the page
                                        remainingTime = timeValue; // Reset the countdown
                                }
                        }, 1000);

                        // Notify the background script to start
                        chrome.runtime.sendMessage({ action: 'start', tabId, interval: timeValue });
                });

                // Update UI
                button.textContent = 'Stop';
                button.classList.add('stop');
                isRunning = true;
        }
});
