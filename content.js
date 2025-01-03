chrome.storage.local.get(['endTime', 'allowAccess'], ({ endTime, allowAccess }) => {
  if (!allowAccess) return; // Jeśli dostęp nie jest dozwolony, nic nie rób

  const interval = setInterval(() => {
    chrome.storage.local.get(['endTime'], ({ endTime }) => {
      if (Date.now() > endTime) {
        alert('Your time is up!');

        // Wyłącz dostęp i zamknij stronę
        chrome.storage.local.set({ allowAccess: false });
        window.close();
        clearInterval(interval);
      }
    });
  }, 1000);
});
