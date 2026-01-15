const dynamicText = document.querySelector("h1 span");
const phrases = ["Web Developer", "Designer", "Coder"];
let phraseIndex = 0;
let letterIndex = 0;
const typingSpeed = 150; // milliseconds per character
const deletingSpeed = 100;

function printLetters(phrase) {
  if (letterIndex == phrase.length) {
    // time to delete the phrase
    setTimeout(clearLetters, 1500);
  } else if (letterIndex < phrase.length) {
    dynamicText.textContent += phrase.charAt(letterIndex);
    letterIndex += 1;
    setTimeout(function () {
      printLetters(phrase);
    }, typingSpeed);
  }
}

function clearLetters() {
  if (letterIndex == -1) {
    // Move to the next phrase
    phraseIndex = (phraseIndex + 1) % phrases.length;
    letterIndex = 0;
    setTimeout(function () {
      printLetters(phrases[phraseIndex]);
    }, 500);
  } else if (letterIndex > -1) {
    let updatedPhrase = "";
    for (let index = 0; index < letterIndex; index++) {
      updatedPhrase += phrases[phraseIndex].charAt(index);
    }
    dynamicText.textContent = updatedPhrase;
    letterIndex -= 1;
    setTimeout(clearLetters, deletingSpeed);
  }
}

// Start the effect
document.addEventListener("DOMContentLoaded", () => {
  printLetters(phrases[phraseIndex]);
});
