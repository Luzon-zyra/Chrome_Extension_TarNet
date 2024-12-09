let activeDomain = null;
let startTime = null;

// Save time spent on a domain to storage
async function saveTime(domain, duration) {
  const data = await chrome.storage.local.get("timeData");
  const timeData = data.timeData || {};
  timeData[domain] = (timeData[domain] || 0) + duration;
  await chrome.storage.local.set({ timeData });
}

// Start tracking for a domain
async function startTracking(domain) {  
  if (activeDomain && startTime) {
    await stopTracking(); // Save the current domain's time
  }
  console.log('start tracking', domain)
  activeDomain = domain;
  startTime = Date.now();
}

// Stop tracking and save elapsed time
async function stopTracking() {
  console.log('stop tracking')
  if (activeDomain && startTime) {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    await saveTime(activeDomain, duration);
    activeDomain = null;
    startTime = null;
  }
}

// Handle tab activity
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    const url = new URL(tab.url);
    startTracking(url.hostname);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const url = new URL(tab.url);
    startTracking(url.hostname);
  }
});

chrome.tabs.onRemoved.addListener(async () => {
  await stopTracking();
});

// Listen for reset requests
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "reset") {
    await chrome.storage.local.set({ timeData: {} });
    sendResponse({ success: true });
  }
});
