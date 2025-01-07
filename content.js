chrome.storage.local.get(['urlTimeConstraint', 'urls'], ({ urlTimeConstraint = {}, urls = {} }) => {
  
  const currentUrl = window.location.href;
  currentBlockedUrl = urls.find(url => currentUrl.startsWith(url));

  const endTime = urlTimeConstraint[currentBlockedUrl];
  if (!endTime) {
    console.log("No time constraint set for this URL.");
    return;
  }

  const interval = setInterval(() => {

    if (Date.now() > endTime) {
      alert('Your time is up!');

      delete urlTimeConstraint[currentBlockedUrl];

      
      // Wyłącz dostęp i zamknij stronę
      chrome.storage.local.set({ urlTimeConstraint }, () => {
        console.log(`Access revoked and URL removed from constraints: ${currentBlockedUrl}`);
        window.close(); // Zamknij bieżącą stronę
      });

      
      clearInterval(interval);
    }

  }, 1000);
});
