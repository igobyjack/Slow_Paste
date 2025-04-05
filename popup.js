document.addEventListener('DOMContentLoaded', function() {
    const toggleElement = document.getElementById('slowPasteToggle');
    const wpmSpeedElement = document.getElementById('wpmSpeed');
  
    chrome.storage.sync.get(['enabled', 'wpm'], function(data) {
      toggleElement.checked = data.enabled !== undefined ? data.enabled : false;
      wpmSpeedElement.value = data.wpm !== undefined ? data.wpm : 120;
    });
  
    toggleElement.addEventListener('change', function() {
      chrome.storage.sync.set({enabled: this.checked});
    });
  
    wpmSpeedElement.addEventListener('change', function() {
      const wpm = parseInt(this.value, 10);
      if (wpm > 0) {
        chrome.storage.sync.set({wpm: wpm});
      }
    });
  });