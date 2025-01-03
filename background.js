// background.js
let isRedirecting = false;

console.log("Service Worker initialized");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && !isRedirecting) {
    chrome.storage.sync.get('urls', ({ urls }) => {
      if (urls && urls.some(url => changeInfo.url.includes(url))) {
        chrome.storage.local.get(['accessGranted', 'endTime'], ({ accessGranted, endTime }) => {
          const now = Date.now();

          // Sprawdź, czy dostęp jest już przyznany i czy czas nie wygasł
          if (accessGranted && accessGranted[changeInfo.url]) {
            if (now > endTime) {
              console.log(`Access expired for ${changeInfo.url}`);

              // Usuń dostęp dla tego URL
              delete accessGranted[changeInfo.url];
              chrome.storage.local.set({ accessGranted });

              // Kontynuuj przekierowanie na limit.html
            } else {
              console.log(`Access already granted for ${changeInfo.url}`);
              return; // Jeśli dostęp jest przyznany i czas jeszcze nie minął, nic nie rób
            }
          }

          // Zapisz URL, na który użytkownik chciał wejść
          chrome.storage.local.set({ pendingUrl: changeInfo.url });

          // Ustaw flagę, aby zapobiec kolejnym przekierowaniom
          isRedirecting = true;

          // Przekieruj na stronę ustawienia czasu
          chrome.tabs.update(tabId, { url: chrome.runtime.getURL('limit.html') }, () => {
            isRedirecting = false; // Resetuj flagę po zakończeniu przekierowania
            console.log("Redirected to limit.html");
          });
        });
      }
    });
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
});