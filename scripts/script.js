class Player {
  constructor(
    type,
    time,
    difficulty,
    totalProblems,
    totalCorrect,
    sumScore,
    percent,
    date,
    initials
  ) {
    this.type = type;
    this.time = time;
    this.difficulty = difficulty;
    this.totalProblems = totalProblems;
    this.totalCorrect = totalCorrect;
    this.sumScore = sumScore;
    this.percent = percent;
    this.date = date;
    this.initials = initials;
  }
}
// html elements
const readyButton = document.getElementById("startBtn");
const getParamsForm = document.getElementById("paramsForm");
const next1 = document.getElementById("next1");
const quiz = document.getElementById("quizForm");
const getQuestion = document.getElementById("ansLabel");
const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const answerInput = document.getElementById("answer");
const getForm = document.getElementById("quizForm");
const getAnsBox = document.getElementById("answer");
const getTimer = document.getElementById("timerText");
const resetBtn = document.getElementById("resetBtn");
const getSaveForm = document.getElementById("savePlayer");
// leaderboard will be an array of player data objects each pushed at the end of a player test session.
const leaderboard = [];
// this will take some processing before info gets here or after to make sure the data is exactly what we want to print in the leaderboard.(ie. right now, player level is indicated numerically because that makes it easier to set the digits in the test, but we need it to print "easy" or "medium" etc. Seems best to use the numbers for setting up the test, and then process the data for the leaderboard return.)
const playerData = [];
let correctAnswers = [];
let playerAnswers = [];
let playerScore = 0;
let scorePercent = 0.0;
let intervalId;
let count;

// playerData is initialized here and rewritten with the player data, which will be a new instance of the Player class.
// let playerData = {};
// this function can be fed params from the param form to return the desired random number based on digits. (easy mode: single digit, medium: two digits, hard: three digits)
// sample instance of player
// const newPlayer = new Player(
//   "60",
//   "easy",
//   "10",
//   "9",
//   "9/10",
//   "90%",
//   "8/17/2025",
//   "JRS"
// );

function startInterval() {
  intervalId = setInterval(() => {
    count--;
    getTimer.textContent = `🕒${count}`;
    if (count === 0) {
      stopInterval();
    }
  }, 1000);
  return;
}

function stopInterval() {
  clearInterval(intervalId);
  count = null; // Now it works
  getForm.hidden = true;
  printSummary();
}

function initQuiz(e) {
  e.preventDefault(e);
  q2.hidden = true;
  for (let i = 0; i < e.target.timeSelect.length; i++) {
    if (e.target.timeSelect[i].checked === true) {
      playerData.push(e.target.timeSelect[i].value);
    }
  }
  for (let i = 0; i < e.target.levelSelect.length; i++) {
    if (e.target.levelSelect[i].checked === true) {
      playerData.push(e.target.levelSelect[i].value);
    }
  }
  count = Number(playerData[0]);
  getForm.hidden = false;
  getTimer.hidden = false;
  getAnsBox.focus = true;
  runQs();
  startInterval();
}

function printSummary() {
  for (let i = 0; i < playerAnswers.length; i++) {
    if (Number(playerAnswers[i]) === correctAnswers[i]) {
      playerScore++;
    }
  }
  scorePercent = (playerScore / (correctAnswers.length - 1)) * 100;
  scorePercent = scorePercent.toFixed(2);
  getTimer.textContent = `Time's up!
        You  got ${playerScore}/${
    correctAnswers.length - 1
  }(${scorePercent}%) correct!`;
  getSaveForm.hidden = false;
  // reveal a hidden html reset button that reloads the page (thus test)
}

function savePlayer(e) {
  e.preventDefault();
  // console.log(e.target.playerInitials.value);
  let newInitials = e.target.playerInitials.value;
  let today = new Date();
  let formattedDate = today.toLocaleDateString();
  let formattedDifficulty = formatDifficulty();
  console.log(formattedDifficulty);
  const newPlayer = new Player(
    // when I add new types of math tests, this will be dynamically rendered.
    "multiplication",
    `${playerData[0]}s`,
    formattedDifficulty,
    correctAnswers.length - 1,
    playerScore,
    `${playerScore}/${correctAnswers.length - 1}`,
    scorePercent,
    formattedDate,
    newInitials
  );
  console.log(newPlayer);
}

function formatDifficulty() {
  let formattedDifficulty;
  if (playerData[1] === "1") {
    formattedDifficulty = "easy";
  } else if (playerData[1] === "2") {
    formattedDifficulty = "medium";
  } else {
    formattedDifficulty = "hard";
  }
  return formattedDifficulty;
}

function getNumber(x) {
  const min = Math.pow(10, x - 1);
  const max = Math.pow(10, x) - 1;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

function multiplyPrintPush(x) {
  let num1 = getNumber(x);
  let num2 = getNumber(x);
  const correctAn = num1 * num2;
  getQuestion.textContent = `${num1} x ${num2} =`;
  correctAnswers.push(correctAn);
  // console.log(correctAnswers);
}

function runQs() {
  getAnsBox.value = "";
  getAnsBox.focus = true;
  multiplyPrintPush(playerData[1]);
}

function processPlayerInput(e) {
  e.preventDefault();
  playerAnswers.push(e.target.answer.value);
  // console.log(playerAnswers);
  runQs();
}

//the time interval function gets called in a function that creates a form element that consists of one math question with one player input. It appends the results (the player's selection and the correct answer) to an object that will get stored and used for generating the final results when the time interval expires. This will get passed to a function that handles saving things to the leaderboard.

// The leaderboard will need:
// player initials
// player correct answers out of total questions asked
// time interval the player set
// difficulty level player set
// the question will be: how to rank the leaderboard? Maybe start with just the percent of the score for now.
// const player = {
//   type: "multiplication",
//   time: "60",
//   difficulty: "easy",
//   totalProblems: "10",
//   totalCorrect: "9",
//   sumScore: "9/10",
//   percent: "90%",
//   date: "8/17/2025",
//   initials: "JRS",
// };
// handle revealing the user params form and hiding the start test button
readyButton.addEventListener(
  "click",
  () => {
    getTimer.hidden = true;
    getParamsForm.hidden = false;
    readyButton.hidden = true;
  }
  //   false
);

next1.addEventListener("click", (e) => {
  e.preventDefault();
  q1.hidden = true;
  q2.hidden = false;
});

getParamsForm.addEventListener("submit", initQuiz);

quiz.addEventListener("submit", processPlayerInput);

resetBtn.addEventListener("click", () => {
  window.location.reload();
});

getSaveForm.addEventListener("submit", savePlayer);
