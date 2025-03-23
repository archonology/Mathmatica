class Player {
  constructor(
    type,
    time,
    difficulty,
    totalProblems,
    totalCorrect,
    points,
    date,
    initials,
    _id
  ) {
    this.type = type;
    this.time = time;
    this.difficulty = difficulty;
    this.totalProblems = totalProblems;
    this.totalCorrect = totalCorrect;
    this.points = points;
    this.date = date;
    this.initials = initials;
    this._id = _id;
  }
}
// html elements
const readyButton = document.getElementById("startBtn");
const getParamsForm = document.getElementById("paramsForm");
const next1 = document.getElementById("next1");
const quiz = document.getElementById("quizForm");
const leadBtn = document.getElementById("leaderBtn");
const getQuestion = document.getElementById("ansLabel");
const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const answerInput = document.getElementById("answer");
const getForm = document.getElementById("quizForm");
const getAnsBox = document.getElementById("answer");
const getTimer = document.getElementById("timerText");
const getResultText1 = document.getElementById("resultText1");
const getResultText2 = document.getElementById("resultText2");
const resetBtn = document.getElementById("resetBtn");
const getSaveForm = document.getElementById("savePlayer");
const correctPing = document.getElementById("correctAns");
const wrongPing = document.getElementById("wrongAns");
const tableBody = document.getElementById("appendScoresHere");
// global objects----------------------------------------
const playerData = [];
let correctAnswers = [];
let playerAnswers = [];
let playerScore = 0;
let playerPoints = 0;
let timeBonusPoints = 0;
let scorePercent = 0.0;
let intervalId;
let count;
const dbName = "playerDB";
const storeName = "playerStore";
// init data from DB
// function init() {
//   initializePlayerDB();
// }

// initDB function
async function initializePlayerDB() {
  return new Promise((resolve, reject) => {
    // const dbName = "playerDB";
    // const storeName = "playerStore";
    const request = indexedDB.open(dbName, 2); // Version 2

    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject(event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { autoIncrement: true });
        console.log("playerDB and playerStore created.");
      } else {
        console.log("playerStore already exists.");
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db); // Resolve with the database instance
      getObjectFromIndexedDB();
    };
  });
}

// Time handling methods ------------------------
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

// ADD/SAVE handling methods ------------------------------
async function saveObjectToIndexedDB(object) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 2);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject(event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const addRequest = store.add(object);

      addRequest.onsuccess = () => {
        resolve(addRequest.result); // Resolve with the generated key
      };

      addRequest.onerror = (event) => {
        console.error("Error adding to IndexedDB:", event);
        reject(event.target.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
}

async function saveObjectToLocalStorage(key, object) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(key, JSON.stringify(object));
      resolve();
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      reject(error);
    }
  });
}

// use save handling functions: ADD ------------------
async function saveToDB(newPlayer) {
  try {
    const idbKey = await saveObjectToIndexedDB(newPlayer);
    console.log("Object saved to IndexedDB with key:", idbKey);

    await saveObjectToLocalStorage("lastPlayer", newPlayer);
    console.log("Object saved to localStorage");
  } catch (error) {
    console.error("Error:", error);
  }
}

// GET handling functions ----------------------------
function getObjectFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error retrieving from local storage:", error);
    return null;
  }
}

async function getObjectFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 2);
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const getRequest = store.getAll();

      getRequest.onsuccess = (event) => {
        resolve(event.target.result);
        console.log(event.target.result);
        createTableRows(event.target.result);
        // createTableRows(playerData);
      };

      getRequest.onerror = (event) => {
        console.error("Error getting object from IndexedDB:", event);
        reject(event.target.error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
}
// Appending DB data to page on page load -------------
function createTableRows(playerData) {
  if (!tableBody) {
    console.error("Table element with ID '" + tableElementId + "' not found.");
    return;
  }
  // sort by highest points
  playerData.sort((a, b) => b.points - a.points);

  for (let i = 0; i < playerData.length; i++) {
    const obj = playerData[i];
    const row = document.createElement("tr");

    row.innerHTML = `
      <th scope="row">${i + 1}</th>
      <td>${obj.initials}</td>
      <td>${obj.points}</td>
      <td>${obj.type} | ${obj.time} | ${obj.difficulty}</td>
      <td>${obj.date}</td>
    `;

    tableBody.appendChild(row);
  }
}

// use get handling functions: GET --------------------
async function getLeaderboardData() {
  try {
    const retrievedLocalStorage = getObjectFromLocalStorage("lastPlayer");
    console.log("Retrieved from local storage: ", retrievedLocalStorage);

    const retrievedIndexedDB = await getObjectFromIndexedDB(); //Assuming the first object saved had key 1.
    console.log("Retrieved from IndexedDB: ", retrievedIndexedDB);
  } catch (error) {
    console.error("Error retrieving: ", error);
  }
}
// Initialize the Quiz --------------------------------
function initQuiz(e) {
  e.preventDefault(e);
  q1.hidden = true;
  q2.hidden = true;
  resetBtn.hidden = false;
  //Get player time select choice
  for (let i = 0; i < e.target.timeSelect.length; i++) {
    if (e.target.timeSelect[i].checked === true) {
      playerData.push(e.target.timeSelect[i].value);
    }
  }
  //Get player level select choice
  for (let i = 0; i < e.target.levelSelect.length; i++) {
    if (e.target.levelSelect[i].checked === true) {
      playerData.push(e.target.levelSelect[i].value);
    }
  }
  //Get player operator select choice
  for (let i = 0; i < e.target.mathSelect.length; i++) {
    if (e.target.mathSelect[i].checked === true) {
      playerData.push(e.target.mathSelect[i].value);
    }
  }
  count = Number(playerData[0]);
  getForm.hidden = false;
  getTimer.hidden = false;
  getAnsBox.focus = true;
  // run the questions
  runQs();
  // start the timer
  startInterval();
}

// Print Results --------------------------------------
function printSummary() {
  const resultTable = document.getElementById("results");

  for (let i = 0; i < playerAnswers.length; i++) {
    if (playerData[1] === "1") {
      if (Number(playerAnswers[i]) === correctAnswers[i]) {
        playerScore++;
        playerPoints++;
      }
    } else if (playerData[1] === "2") {
      if (Number(playerAnswers[i]) === correctAnswers[i]) {
        playerPoints = playerPoints + 5;
        playerScore++;
      }
    } else if (playerData[1] === "3") {
      if (Number(playerAnswers[i]) === correctAnswers[i]) {
        playerPoints = playerPoints + 25;
        playerScore++;
      }
    }
  }
  // calculate time bonus
  timeBonus();
  // scorePercent = (playerScore / (correctAnswers.length - 1)) * 100;
  // scorePercent = scorePercent.toFixed(2);
  getTimer.textContent = "❌";
  let today = new Date();
  let formattedDate = today.toLocaleDateString();
  const row = document.createElement("tr");
  [time, level, math] = playerData;
  row.innerHTML = `
    <th scope="row" style="font-weight: 500; color: greenyellow">${playerPoints}</th>
      <td style="font-size: 18px; font-weight: 500">${math} | ${time}s | ${formatDifficulty(
    level
  )}</td>
      <td style="font-size: 18px; font-weight: 500">${formattedDate}</td>
    `;

  resultTable.appendChild(row);
  // getResultText1.textContent = "Nice One!";
  // getResultText2.textContent = `  Time Bonus: ${timeBonusPoints}pts |
  // Total Points: ${playerPoints + timeBonusPoints}pts`;

  getParamsForm.hidden = true;
  quiz.hidden = true;
  getSaveForm.hidden = false;
}

function timeBonus() {
  if (playerData[0] === "60") {
    timeBonusPoints = playerScore * 5;
  } else if (playerData[0] === "180") {
    timeBonusPoints = playerScore * 3;
  } else {
    timeBonusPoints = playerScore;
  }
}

function savePlayer(e) {
  e.preventDefault();
  let newInitials = e.target.playerInitials.value;
  let today = new Date();
  let formattedDate = today.toLocaleDateString();
  let formattedDifficulty = formatDifficulty();
  const newPlayer = new Player(
    // when I add new types of math tests, this will be dynamically rendered.
    playerData[2],
    `${playerData[0]}s`,
    formattedDifficulty,
    correctAnswers.length - 1,
    playerScore,
    playerPoints,
    formattedDate,
    newInitials.toUpperCase()
  );
  saveToDB(newPlayer);
  window.location.reload();
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
// Maths ----------------------------------------------------------------------------------
function getNumber(x) {
  const min = Math.pow(10, x - 1);
  const max = Math.pow(10, x) - 1;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

function multiplyPrintPush(x) {
  let num1 = getNumber(x);
  let num2 = getNumber(1);
  const correctAn = num1 * num2;
  getQuestion.textContent = `${num1} x ${num2} =`;
  correctAnswers.push(correctAn);
}

function addPrintPush(x) {
  let num1 = getNumber(x);
  let num2 = getNumber(1);
  const correctAn = num1 + num2;
  getQuestion.textContent = `${num1} + ${num2} =`;
  correctAnswers.push(correctAn);
}

function subtractPrintPush(x) {
  let num1 = getNumber(x);
  let num2 = getNumber(1);
  let correctAn;
  if (num1 > num2) {
    correctAn = num1 - num2;
    getQuestion.textContent = `${num1} - ${num2} =`;
  } else {
    correctAn = num2 - num1;
    getQuestion.textContent = `${num2} - ${num1} =`;
  }
  correctAnswers.push(correctAn);
}
// this method offers the chance for floating point numbers, so check with user about if they want it included or if they want it to only return integers.
function dividePrintPush(x) {
  let num1 = getNumber(x);
  let num2 = getNumber(1);
  let correctAn;
  if (num1 > num2) {
    correctAn = num1 / num2;
    getQuestion.textContent = `${num1} / ${num2} =`;
  } else {
    correctAn = num2 / num1;
    getQuestion.textContent = `${num2} / ${num1} =`;
  }
  correctAnswers.push(correctAn);
}
// Run Maths -------------------------------------------------------------------------
function runQs() {
  getAnsBox.value = "";
  getAnsBox.focus = true;
  if (playerData[2] === "add") {
    addPrintPush(playerData[1]);
  } else if (playerData[2] === "subtract") {
    subtractPrintPush(playerData[1]);
  } else if (playerData[2] === "divide") {
    dividePrintPush(playerData[1]);
  } else {
    multiplyPrintPush(playerData[1]);
  }
}
// Answer checking ----------------------------------------------------------------------
function processPlayerInput(e) {
  e.preventDefault();
  correctPing.textContent = "";
  wrongPing.textContent = "";
  playerAnswers.push(e.target.answer.value);
  // display answer
  if (
    Number(playerAnswers[playerAnswers.length - 1]) ===
    correctAnswers[correctAnswers.length - 1]
  ) {
    // targeted html element
    correctPing.textContent = `${correctAnswers[correctAnswers.length - 1]}`;
  } else {
    wrongPing.textContent = `${correctAnswers[correctAnswers.length - 1]}`;
  }
  runQs();
}

// Listening ------------------------------------------------------------------------------
readyButton.addEventListener("click", () => {
  getTimer.hidden = true;
  getParamsForm.hidden = false;
  readyButton.hidden = true;
});

getParamsForm.addEventListener("submit", initQuiz);

quiz.addEventListener("submit", processPlayerInput);

resetBtn.addEventListener("click", () => {
  window.location.reload();
});

getSaveForm.addEventListener("submit", savePlayer);

window.addEventListener("load", async () => {
  try {
    const db = await initializePlayerDB();
    console.log("playerDB initialized:", db);
  } catch (error) {
    console.error("Error initializing playerDB:", error);
  }
});
