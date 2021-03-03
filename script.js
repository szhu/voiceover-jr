let overrideClick = true;

window.addEventListener("keydown", (e) => {
  console.log(e);
  if (e.code === "Space") {
    e.preventDefault();
    if (!e.repeat) {
      speakSelectedElement();
    }
  }
  if (e.code === "ArrowUp") {
    e.preventDefault();
    selectNewElement(selectedElement.previousElementSibling);
    if (e.shiftKey) speakSelectedElement();
  }
  if (e.code === "ArrowDown") {
    e.preventDefault();
    selectNewElement(selectedElement.nextElementSibling);
    if (e.shiftKey) speakSelectedElement();
  }
  if (e.code === "ArrowRight") {
    e.preventDefault();
    selectNewElement(selectedElement.firstElementChild);
    if (e.shiftKey) speakSelectedElement();
  }
  if (e.code === "ArrowLeft") {
    e.preventDefault();
    selectNewElement(selectedElement.parentElement);
    if (e.shiftKey) speakSelectedElement();
  }
  if (e.code === "Enter") {
    e.preventDefault();
    overrideClick = false;
    selectedElement.click();
    setTimeout(() => (overrideClick = true), 0);
  }
});

window.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.code === "Space") {
    stopSpeaking();
  }
});

window.addEventListener(
  "click",
  (e) => {
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

window.addEventListener("mousemove", (e) => {
  if (lastHoverEl === e.target) return;
  lastHoverEl = e.target;

  if (lastValidHoverEl === e.target) return;

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

    beep(10);
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

let selectedElement = document.documentElement;

function selectNewElement(newElement) {
  if (newElement == null) {
    beep(100);
    return;
  }

  selectedElement.style.background = "";
  selectedElement.style.outline = "";
  selectedElement.style.opacity = "";

  selectedElement = newElement;

  selectedElement.style.background = "#ffff004f";
  selectedElement.style.outline = "4px dashed black";
  selectedElement.style.opacity = "0.5";

  let msgTxt = "";
  if (selectedElement.innerText.trim().length === 0) {
    msgTxt += "blank ";
  }
  msgTxt += selectedElement.tagName;
  if (selectedElement.childElementCount > 0) {
    msgTxt += `, ${selectedElement.childElementCount} items`;
  }
  let msg = new SpeechSynthesisUtterance(msgTxt);

  stopSpeaking();
  window.speechSynthesis.speak(msg);
}

selectNewElement(selectedElement);

//

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
