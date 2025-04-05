let isTyping = false;

console.log("Slow Paste content script loaded");


chrome.storage.sync.get(['enabled', 'wpm'], function(data) {
  if (data.enabled === undefined) {
    chrome.storage.sync.set({enabled: false});
  }
  if (data.wpm === undefined) {
    chrome.storage.sync.set({wpm: 120});
  }
});

document.addEventListener('paste', function(e) {
  console.log("Paste event captured");
  chrome.storage.sync.get(['enabled', 'wpm'], function(data) {
    console.log("Storage state:", data);
    if (data.enabled) {
      e.preventDefault();
      const activeElement = document.activeElement;
      console.log("Active element:", activeElement && activeElement.tagName);

      if (activeElement && (
          activeElement.isContentEditable || 
          activeElement.tagName === 'INPUT' || 
          activeElement.tagName === 'TEXTAREA')) {
        
        navigator.clipboard.readText().then(clipText => {
          console.log("Clipboard text:", clipText);
          if (clipText && !isTyping) {
            const charDelay = 60000 / (data.wpm * 5);
            console.log("Starting slow paste with char delay:", charDelay);
            typeCharByChar(activeElement, clipText, charDelay);
          }
        });
      } else {
        console.log("Active element is not editable");
      }
    } else {
      console.log("Extension not enabled");
    }
  });
}, { capture: true });

function typeCharByChar(element, text, delay) {
  if (isTyping) return;
  
  isTyping = true;
  let i = 0;
  
  function typeNextChar() {
    if (i < text.length) {
      const char = text.charAt(i);
      
      if (element.isContentEditable) {
        // For contentEditable elements
        insertCharInContentEditable(element, char);
      } else {
        // For input and textarea elements
        insertCharInInputElement(element, char);
      }
      
      i++;
      setTimeout(typeNextChar, delay);
    } else {
      isTyping = false;
    }
  }
  
  typeNextChar();
}

function insertCharInContentEditable(element, char) {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  const textNode = document.createTextNode(char);
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.setEndAfter(textNode);
  sel.removeAllRanges();
  sel.addRange(range);
}

function insertCharInInputElement(element, char) {
  const start = element.selectionStart;
  const end = element.selectionEnd;
  const value = element.value;
  
  element.value = value.substring(0, start) + char + value.substring(end);
  element.selectionStart = element.selectionEnd = start + 1;
  
  const inputEvent = new Event('input', { bubbles: true });
  element.dispatchEvent(inputEvent);
}

chrome.storage.onChanged.addListener(function(changes) {
  for (let key in changes) {
    if (key === 'enabled') {
    }
  }
});
