// Elements
const testAreaWrapper = document.querySelector('.test-area-wrapper');
const testArea = document.querySelector('#user-typing-field');
const startText = document.querySelector('#origin-text p');
const resetButton = document.querySelector('#reset');
const stopwatch = document.querySelector('.timer');
const totalWordCounter = document.querySelector('.words');
const finalWpmScore = document.querySelector('.wpm');
const errorCount = document.querySelector('.errors');
const difficultySelectors = document.querySelectorAll('.filters-list li a');
const previousScore = document.querySelector('.previous-score');

// Initial state
let timer = [0, 0, 0, 0];
let interval;
let timerRunning = false;
let totalWordsTyped = 0;
let wordSpeed = 0;
let errors = 0;
const textArray = [textEasy, textIntermediate, textExpert]; // defined in testText.js

// ---------------------------- //
// Initialize typing test copy //
// -------------------------- //
startText.innerHTML = textArray[0];

// -------------------------------------------------------- //
// Helper function: Add leading zero to numbers 9 or below //
// ------------------------------------------------------ //
const leadingZero = time => {
  if (time <= 9) {
    time = `0${time}`;
  }
  return time;
};

// -------------------------------------------------- //
// Run the stopwatch (minute : second : millisecond) //
// ------------------------------------------------ //
const runTimer = () => {
  const currentTime = `${leadingZero(timer[0])}:${leadingZero(
    timer[1],
  )}:${leadingZero(timer[2])}`;
  stopwatch.innerHTML = currentTime;

  // Increments by 1 every 10ms
  timer[3]++;
  timer[0] = Math.floor(timer[3] / 100 / 60);
  timer[1] = Math.floor(timer[3] / 100 - timer[0] * 60);
  timer[2] = Math.floor(timer[3] - timer[1] * 100 - timer[0] * 6000);
};

// ---------------- //
// Set final score //
// -------------- //
const setFinalScore = () => {
  const wpmCalculation = totalWordsTyped / (timer[3] / 6000);
  wordSpeed = wpmCalculation.toFixed(2);
  finalWpmScore.innerText = `Score: ${wpmCalculation.toFixed(2)}wpm`;
};

// ----------------------------------------------------------- //
// Match the text entered with the provided text on the page: //
// --------------------------------------------------------- //
const spellCheck = () => {
  const sampleText = document.querySelector('#origin-text p').innerHTML;
  const userEnteredText = testArea.value;
  const sameTextAsShown = sampleText.substring(0, userEnteredText.length);

  if (userEnteredText === sampleText) {
    testAreaWrapper.style.borderColor = '#429890'; // Green
    clearInterval(interval);
    setFinalScore();
  } else if (userEnteredText === sameTextAsShown) {
    testAreaWrapper.style.borderColor = '#65CCF3'; // Blue
  } else {
    testAreaWrapper.style.borderColor = '#E95D0F'; // Orange
  }
};

// -------------------------------- //
// Increment number of words typed //
// ------------------------------ //
const calculateWords = () => {
  const wordsTyped = testArea.value.split(' ').length - 1;
  // Set global totalWordsTyped variable for wpm calculation
  totalWordsTyped = wordsTyped;
  totalWordCounter.innerText = `Words: ${wordsTyped}`;
};

// ------------- //
// Count errors //
// ----------- //
const countErrors = () => {
  const sampleText = document.querySelector('#origin-text p').innerHTML;
  const userEnteredText = testArea.value;
  const sameTextAsShown = sampleText.substring(0, userEnteredText.length);

  if (userEnteredText !== sameTextAsShown) {
    errors++;
  }
  errorCount.innerHTML = `Errors: ${errors}`;
};

// -------------------------------------- //
// Start the timer if text area is empty //
// -------------------------------------//
const startTimer = () => {
  const userEnteredText = testArea.value.length;
  if (userEnteredText === 0 && !timerRunning) {
    timerRunning = true;
    interval = setInterval(runTimer, 10);
  }
};

// ------------------------------------------------------ //
// Change typing challenge copy and update selected link //
// ---------------------------------------------------- //
difficultySelectors.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    let level = link.getAttribute('difficulty-level');
    let n = 0;

    if (level === 'easy') {
      n = 0;
    } else if (level === 'intermediate') {
      n = 1;
    } else if (level === 'hard') {
      n = 2;
    } else {
      level = 0;
    }

    startText.innerHTML = textArray[n];
  });
});

// ------------------------------ //
// Set classlist for clicked tab //
// ---------------------------- //
difficultySelectors.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    difficultySelectors.forEach(selector => {
      selector.classList.remove('selected');
    });
    link.classList.add('selected');
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
  errorCount.innerHTML = 'Errors: 0';
  // Word count
  totalWordsTyped = 0;
  finalWpmScore.innerText = 'Score: 0.00wpm';
  // Timer
  testArea.value = '';
  stopwatch.innerHTML = '00:00:00';
  testAreaWrapper.style.borderColor = 'gray';
};

// --------------------------------------------------------- //
// Event listeners for keyboard input and the reset button  //
// ------------------------------------------------------- //
testArea.addEventListener('keypress', startTimer, false);
testArea.addEventListener('keyup', spellCheck, false);
testArea.addEventListener('keyup', countErrors, false);
testArea.addEventListener('keyup', calculateWords, false);
resetButton.addEventListener('click', reset, false);
resetButton.addEventListener('click', setPreviousScore, false);
