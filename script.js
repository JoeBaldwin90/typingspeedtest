// Elements
const testAreaWrapper = document.querySelector(".test-area-wrapper");
const testArea = document.querySelector("#user-typing-field");
const startText = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const stopwatch = document.querySelector(".timer");
const totalWordCounter = document.querySelector(".words");
const finalWpmScore = document.querySelector(".wpm");
const errorCount = document.querySelector(".errors");
const difficultySelectors = document.querySelectorAll(".filters-list li a");
const previousScore = document.querySelector(".previous-score");

// Initial state
var timer = [0, 0, 0, 0];
var interval;
var timerRunning = false;
var totalWordsTyped = 0;
var wordSpeed = 0;
var errors = 0;
const textArray = [textEasy, textIntermediate, textExpert]; // testText.js

// ---------------------------- //
// Initialize typing test copy //
// -------------------------- //
startText.innerHTML = textArray[0];

// -------------------------------------------------------- //
// Helper function: Add leading zero to numbers 9 or below //
// ------------------------------------------------------ //
const leadingZero = time => {
  if (time <= 9) {
    time = "0" + time;
  }
  return time;
};

// -------------------------------------------------- //
// Run the stopwatch (minute : second : millisecond) //
// ------------------------------------------------ //
const runTimer = () => {
  currentTime = `
  ${leadingZero(timer[0])}:
  ${leadingZero(timer[1])}:
  ${leadingZero(timer[2])}
  `;
  stopwatch.innerHTML = currentTime;

  // Increments by 1 every 10ms
  timer[3]++;
  timer[0] = Math.floor(timer[3] / 100 / 60);
  timer[1] = Math.floor(timer[3] / 100 - timer[0] * 60);
  timer[2] = Math.floor(timer[3] - timer[1] * 100 - timer[0] * 6000);
};

// ----------------------------------------------------------- //
// Match the text entered with the provided text on the page: //
// --------------------------------------------------------- //
const spellCheck = () => {
  let sampleText = document.querySelector("#origin-text p").innerHTML;
  let userEnteredText = testArea.value;
  let sameTextAsShown = sampleText.substring(0, userEnteredText.length);

  if (userEnteredText == sampleText) {
    testAreaWrapper.style.borderColor = "#429890"; // Green
    clearInterval(interval);
    setFinalScore();
  } else if (userEnteredText == sameTextAsShown) {
    testAreaWrapper.style.borderColor = "#65CCF3"; // Blue
  } else {
    testAreaWrapper.style.borderColor = "#E95D0F"; // Orange
  }
};

// -------------------------------- //
// Increment number of words typed //
// ------------------------------ //
const calculateWords = () => {
  let wordsTyped = testArea.value.split(" ").length - 1;
  // Set global totalWordsTyped variable for wpm calculation
  totalWordsTyped = wordsTyped;
  totalWordCounter.innerText = `Words: ${wordsTyped}`;
};

// ---------------- //
// Set final score //
// -------------- //
const setFinalScore = () => {
  let wpmCalculation = totalWordsTyped / (timer[3] / 6000); 
  wordSpeed = wpmCalculation.toFixed(2); 
  finalWpmScore.innerText = `Score: ${wpmCalculation.toFixed(2)}wpm`;
}

// ------------- //
// Count errors //
// ----------- //
const countErrors = () => {
  let sampleText = document.querySelector("#origin-text p").innerHTML;
  let userEnteredText = testArea.value;
  let sameTextAsShown = sampleText.substring(0, userEnteredText.length);

  if (userEnteredText !== sameTextAsShown) {
    errors++;
  }
  errorCount.innerHTML = `Errors: ${errors}`;
};

// -------------------------------------- //
// Start the timer if text area is empty //
// -------------------------------------//
const startTimer = () => {
  let userEnteredText = testArea.value.length;
  if (userEnteredText === 0 && !timerRunning) {
    timerRunning = true;
    interval = setInterval(runTimer, 10);
  }
};

// ------------------------------------------------------ //
// Change typing challenge copy and update selected link //
// ---------------------------------------------------- //
difficultySelectors.forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    let level = this.getAttribute("difficulty-level");
    let n = 0;
    level == "easy"
      ? (n = 0)
      : level == "intermediate"
      ? (n = 1)
      : level == "hard"
      ? (n = 2)
      : (level = 0);
    startText.innerHTML = textArray[n];
  });
});

// ------------------------------ //
// Set classlist for clicked tab //
// ---------------------------- //
difficultySelectors.forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    difficultySelectors.forEach(selector => {
      selector.classList.remove("selected");
    });
    this.classList.add("selected");
  });
});

// ------------------- //
// Set previous score //
// ----------------- //
const setPreviousScore = () => {
  previousScore.innerText = `Score to beat: ${wordSpeed}wpm`;
};

// ----------------- //
// Reset everything //
// --------------- //
const reset = () => {
  // Interval
  clearInterval(interval);
  interval = null;
  // Timer
  timerRunning = false;
  timer = [0, 0, 0, 0];
  // Errors
  errors = 0;
  errorCount.innerHTML = "Errors: 0";
  // Word count
  totalWordsTyped = 0;
  finalWpmScore.innerText = "Score: 0.00wpm";
  // Timer
  testArea.value = "";
  stopwatch.innerHTML = "00:00:00";
  testAreaWrapper.style.borderColor = "gray";
};

// --------------------------------------------------------- //
// Event listeners for keyboard input and the reset button  //
// ------------------------------------------------------- //
testArea.addEventListener("keypress", startTimer, false);
testArea.addEventListener("keyup", spellCheck, false);
testArea.addEventListener("keyup", countErrors, false);
testArea.addEventListener("keyup", calculateWords, false);
resetButton.addEventListener("click", reset, false);
resetButton.addEventListener("click", setPreviousScore, false);