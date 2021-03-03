let overrideClick = true;

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    // When Space is pressed, speak the selected element.
    e.preventDefault();
    if (!e.repeat) {
      speakSelectedElement();
    }
  }
  if (e.code === "ArrowUp") {
    // When Up is pressed, select the previous element at the current level.
    e.preventDefault();
    selectNewElement(selectedElement.previousElementSibling);
    // ...and speak its contents if Shift was held.
    if (e.shiftKey) speakSelectedElement();
  }
  if (e.code === "ArrowDown") {
    // When Up is pressed, select the next element at the current level.
    e.preventDefault();
    selectNewElement(selectedElement.nextElementSibling);
    // ...and speak its contents if Shift was held.
    if (e.shiftKey) speakSelectedElement();
  }
  if (e.code === "ArrowRight") {
    // When Right is pressed, select the first sub-element of this element.
    e.preventDefault();
    selectNewElement(selectedElement.firstElementChild);
    // ...and speak its contents if Shift was held.
    if (e.shiftKey) speakSelectedElement();
  }
  if (e.code === "ArrowLeft") {
    // When Left is pressed, select parent element.
    e.preventDefault();
    selectNewElement(selectedElement.parentElement);
    // ...and speak its contents if Shift was held.
    if (e.shiftKey) speakSelectedElement();
  }
  if (e.code === "Enter") {
    // When Enter is pressed, click the current element. For example, if the
    // current element is a link, this will open the link.
    e.preventDefault();
    overrideClick = false;
    selectedElement.click();
    setTimeout(() => (overrideClick = true), 0);
  }
});

window.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.code === "Space") {
    // When Space is unpressed, stop speaking.
    stopSpeaking();
  }
});

window.addEventListener(
  "click",
  (e) => {
    // When an element is clicked, select that element, unless the user pressed
    // Enter and is trying to make a real click happen.
    if (overrideClick) {
      e.preventDefault();
      e.stopImmediatePropagation();
      selectNewElement(e.target);
    }
  },
  { capture: true }
);

let lastHoverEl = undefined;
let lastValidHoverEl = undefined;

// When moving the mouse around, if Shift is held and the cursor is hovering
// over a text element, speak it.
window.addEventListener("mousemove", (e) => {
  if (lastHoverEl === e.target) return;
  lastHoverEl = e.target;

  if (lastValidHoverEl === e.target) return;

  // Check that the hovered-over element directly contains text.
  let childTextNodes = Array.from(e.target.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE
  );
  if (childTextNodes.length === 0) return;
  let text = childTextNodes
    .map((node) => node.wholeText)
    .join("")
    .trim();
  if (text.length === 0) return;
  console.log(text);

  if (e.shiftKey) {
    lastValidHoverEl = e.target;

    // Emit a click sound -- useful for knowing when the mouse crosses a
    // boundary.
    beep(10);

    // Immediately speak what's under the cursor.
    stopSpeaking();
    let msg = new SpeechSynthesisUtterance(lastValidHoverEl.innerText);
    window.speechSynthesis.speak(msg);
  }
});

function speakSelectedElement() {
  let msg = new SpeechSynthesisUtterance(selectedElement.innerText);
  window.speechSynthesis.speak(msg);
}

function stopSpeaking() {
  speechSynthesis.cancel();
}

// When selecting a new element:
function selectNewElement(newElement) {
  // Check that no error occurred.
  if (newElement == null) {
    beep(100);
    return;
  }

  // Clear the styling for the previously-selected element.
  selectedElement.style.background = "";
  selectedElement.style.outline = "";
  selectedElement.style.opacity = "";

  // Mark the new element as selected.
  selectedElement = newElement;

  // Set styling for the newly-selected element.
  selectedElement.style.background = "#ffff004f";
  selectedElement.style.outline = "4px dashed black";
  selectedElement.style.opacity = "0.5";

  // Speak some metadata about the element. Specifically, we speak:
  // - Whether it contains text ("blank" otherwise)
  // - The tag name
  // - The number of sub-elements it contains, if any
  let msgTxt = "";
  if (selectedElement.innerText.trim().length === 0) {
    msgTxt += "blank ";
  }
  msgTxt += selectedElement.tagName;
  if (selectedElement.childElementCount > 0) {
    msgTxt += `, ${selectedElement.childElementCount} items`;
  }
  let msg = new SpeechSynthesisUtterance(msgTxt);

  // Immediately speak this metadata.
  stopSpeaking();
  window.speechSynthesis.speak(msg);
}

// This causes the initial <html> element to be announced and highlighted.
let selectedElement = document.documentElement;
selectNewElement(selectedElement);

// "Beep" code from: https://stackoverflow.com/a/29641185/782045

//if you have another AudioContext class use that one, as some browsers have a limit
var audioCtx = new (window.AudioContext ||
  window.webkitAudioContext ||
  window.audioContext)();

//All arguments are optional:

//duration of the tone in milliseconds. Default is 500
//frequency of the tone in hertz. default is 440
//volume of the tone. Default is 1, off is 0.
//type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
//callback to use on end of tone
function beep(duration, frequency, volume, type, callback) {
  audioCtx.resume();

  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (volume) {
    gainNode.gain.value = volume;
  }
  if (frequency) {
    oscillator.frequency.value = frequency;
  }
  if (type) {
    oscillator.type = type;
  }
  if (callback) {
    oscillator.onended = callback;
  }

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + (duration || 500) / 1000);
}

// End "beep" code
