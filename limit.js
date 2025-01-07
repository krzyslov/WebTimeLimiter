const startButton = document.getElementById('start-timer');
const timeInput = document.getElementById('time');
const purposeInput = document.getElementById('purpose');

startButton.addEventListener('click', () => {
  const endTime = Date.now() + parseInt(timeInput.value, 10) * 60 * 1000;
  const purpose = purposeInput.value;

  if (!endTime || !purpose) {
    alert('Please enter valid inputs.');
    return;
  }

  // Pobierz URL, który użytkownik chciał odwiedzić
  chrome.storage.local.get('pendingUrl', (data) => {
    
    var newBlockedUrl;

    const pendingUrl = data.pendingUrl;
    if (!pendingUrl) {
      alert('No target URL found.');
      return;
    }
    

    chrome.storage.local.get('urls', ({ urls = [] }) => {
      newBlockedUrl = urls.find(url => pendingUrl.startsWith(url));
      
      if (!newBlockedUrl) {
        alert("No matching blocked URL found.");
        return;
      }
      chrome.storage.local.get('urlTimeConstraint', ({ urlTimeConstraint = {} }) => {
        urlTimeConstraint[newBlockedUrl] = endTime;
        chrome.storage.local.set({ urlTimeConstraint }, () => {
          chrome.tabs.update({ url: pendingUrl }); // Przekieruj użytkownika na stronę docelową
          alert(`Timer set for ${newBlockedUrl} until ${new Date(endTime).toLocaleTimeString()}.`);
        });
      });

    });
  });
});
