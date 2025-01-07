// background.js
console.log("Service Worker initialized");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && !changeInfo.url.startsWith(chrome.runtime.getURL('limit.html'))) {
    chrome.storage.local.get(['urlTimeConstraint', 'urls'], ({ urlTimeConstraint = {}, urls = [] }) => {
      console.log("urls: ", urls);
      console.log("urlTimeConstraint:", urlTimeConstraint );
      console.log("Checking URL:", changeInfo.url);
      // Sprawdź, czy URL znajduje się na liście zablokowanych
      


      const isBlocked = urls && urls.some(url => changeInfo.url.startsWith(url));
      console.log('is Blcoked: ', isBlocked);
      // Sprawdź, czy dostęp jest przyznany
      const isAccessGranted = Object.keys(urlTimeConstraint).some(baseUrl => changeInfo.url.startsWith(baseUrl));
      console.log('is AccessGranted: ', isAccessGranted);
    
      if (isBlocked && !isAccessGranted) {
        console.log(`Blocking URL: ${changeInfo.url}`);
        chrome.storage.local.set({ pendingUrl: changeInfo.url });

        chrome.tabs.update(tabId, { url: chrome.runtime.getURL('limit.html') }, () => {
          console.log("Redirected to limit.html");
        });
      } else {
        console.log(`Access granted for ${changeInfo.url}`);
      }


    });
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
});