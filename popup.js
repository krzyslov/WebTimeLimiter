console.log('This is a popup!');
const urlList = document.getElementById('url-list');
const newUrlInput = document.getElementById('new-url');
const addUrlButton = document.getElementById('add-url');


function renderList() {
  chrome.storage.sync.get('urls', ({ urls }) => {
    urlList.innerHTML = '';
    (urls || []).forEach(url => {
      const li = document.createElement('li');
      li.textContent = url;
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.onclick = () => removeUrl(url);
      li.appendChild(removeButton);
      urlList.appendChild(li);
    });
  });
}

function addUrl() {
  const url = newUrlInput.value;
  if (!url) return;
  chrome.storage.sync.get('urls', ({ urls }) => {
    const updatedUrls = urls ? [...urls, url] : [url];
    chrome.storage.sync.set({ urls: updatedUrls }, renderList);
    newUrlInput.value = '';
  });
}

function removeUrl(url) {
  chrome.storage.sync.get('urls', ({ urls }) => {
    const updatedUrls = urls.filter(item => item !== url);
    chrome.storage.sync.set({ urls: updatedUrls }, renderList);
  });
}

addUrlButton.addEventListener('click', addUrl); // Przypisanie funkcji do przycisku
renderList();

chrome.storage.local.get('accessGranted', ({ accessGranted }) => {
  console.log("Access granted data:", accessGranted);
});

chrome.storage.local.get(null, (data) => {
  console.log("All data in chrome.storage.local:", data);
});

console.log(new Date(1735842189257).toLocaleString());