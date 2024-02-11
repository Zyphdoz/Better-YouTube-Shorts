chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = new URL(details.url);
  if (url.hostname.includes('youtube.com')) {
    chrome.scripting.executeScript({
      target: {tabId: details.tabId},
      files: ['redirect.js', 'addMissingChannelNames.js']
    });
  }
});