const startButton = document.getElementById('start-timer');
const timeInput = document.getElementById('time');
const purposeInput = document.getElementById('purpose');

startButton.addEventListener('click', () => {
  const time = parseInt(timeInput.value, 10);
  const purpose = purposeInput.value;

  if (!time || !purpose) {
    alert('Please enter valid inputs.');
    return;
  }

  // Pobierz URL, który użytkownik chciał odwiedzić
  chrome.storage.local.get('pendingUrl', ({ pendingUrl }) => {
    if (!pendingUrl) {
      alert('No target URL found.');
      return;
    }

    // Zapisz czas końcowy i pozwolenie na dostęp
    chrome.storage.local.get('accessGranted', ({ accessGranted }) => {
      const updatedAccess = accessGranted || {};
      updatedAccess[pendingUrl] = true;

      chrome.storage.local.set({
        endTime: Date.now() + time * 60 * 1000,
        allowAccess: true,
        accessGranted: updatedAccess
      }, () => {
        chrome.tabs.update({ url: pendingUrl }); // Przekieruj użytkownika na stronę docelową
        console.log(`Access granted for ${pendingUrl}`);
      });
    });
  });
});