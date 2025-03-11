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
// leaderboard will be an array of player data objects each pushed at the end of a player test session.
const leaderboard = [];
let correctAnswers = [];
let playerAnswers = [];
const readyButton = document.getElementById("startBtn");
const getParamsForm = document.getElementById("paramsForm");
const next1 = document.getElementById("next1");
const quiz = document.getElementById("quizForm");
const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const answerInput = document.getElementById("answer");

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
// console.log(newPlayer.initials);
function getNumber(x) {
  const min = Math.pow(10, x - 1);
  const max = Math.pow(10, x) - 1;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
  // // Example usage: generate a 4-digit random number
  // getNumber(4);
  //
}

function multiplySolutions(x) {
  const correctAns = getNumber(x) * getNumber(x);
  correctAnswers.push(correctAns);
}

// function handleQuestionSubmit(e, quizData) {
//   e.preventDefault();
// }

function runTest(playerParams) {
  const getForm = document.getElementById("quizForm");
  const getAnsBox = document.getElementById("answer");
  const getQuestion = document.getElementById("ansLabel");
  const getTimer = document.getElementById("timerText");
  let count = Number(playerParams[0]);
  let startTimer;
  getAnsBox.autofocus = true;

  getForm.hidden = false;
  getTimer.textContent = `🕒${count}`;
  getTimer.hidden = false;
  getQuestion.textContent = `${getNumber(playerParams[1])} x ${getNumber(
    playerParams[1]
  )} =`;

  if (!startTimer) {
    setInterval(() => {
      if (count > 0) {
        count--;
        getTimer.textContent = `🕒${count}`;
      } else if (count === 0) {
        clearInterval(startTimer);
        timer = null;
        getForm.hidden = true;
        getTimer.textContent = "Time's up!";
      }
    }, 1000);
  }
}
// create a function that takes in a time param and sets an interval based on it.

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
    getParamsForm.hidden = false;
    readyButton.hidden = true;
  }
  //   false
);

next1.addEventListener("click", (e) => {
  //prevent the DOM from reloading when the next button is clicked.
  e.preventDefault();
  q1.hidden = true;
  q2.hidden = false;
});

getParamsForm.addEventListener("submit", (e) => {
  e.preventDefault(e);
  q2.hidden = true;
  const playerData = [];
  for (let i = 0; i < e.target.timeSelect.length; i++) {
    if (e.target.timeSelect[i].checked === true) {
      console.log(e.target.timeSelect[i]);
      playerData.push(e.target.timeSelect[i].value);
      console.log(playerData);
    }
  }
  for (let i = 0; i < e.target.levelSelect.length; i++) {
    if (e.target.levelSelect[i].checked === true) {
      console.log(e.target.levelSelect[i]);
      playerData.push(e.target.levelSelect[i].value);
      console.log(playerData);
    }
  }
  runTest(playerData);
  // the log below will return true or false based on if the levelSelect was checked or not.
  // console.log(e.target.levelSelect[0].checked);
});
quiz.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e.target.answer.value);
});
