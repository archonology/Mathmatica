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

// Example usage on page load:
window.addEventListener("load", async () => {
  try {
    const db = await initializePlayerDB();
    console.log("playerDB initialized:", db);

    // You can now use the 'db' instance to perform operations on playerStore
    // Example:
    // const transaction = db.transaction(['playerStore'], 'readwrite');
    // const store = transaction.objectStore('playerStore');
    // store.add({ playerName: 'John Doe', score: 100 });
  } catch (error) {
    console.error("Error initializing playerDB:", error);
  }
});
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
      <td>${obj.points}pts</td>
      <td>${obj.type} | ${obj.time} | ${obj.difficulty}</td>
    `;

    tableBody.appendChild(row);
  }
}

// Assuming you have a table with id "myTableBody" in your HTML:
// <table id="myTable">
//   <tbody id="myTableBody">
//   </tbody>
// </table>

// createTableRows(playerData, "myTableBody"); // Call the function to populate the table

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
  getResultText1.textContent = "Nice One!";
  getResultText2.textContent = `  Time Bonus: ${timeBonusPoints}pts |
  Total Points: ${playerPoints + timeBonusPoints}pts`;
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
    playerPoints,
    formattedDate,
    newInitials
  );
  console.log(newPlayer);
  saveToDB(newPlayer);
  getSaveForm.hidden = true;
  getTimer.hidden = true;
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

// next1.addEventListener("click", (e) => {
//   e.preventDefault();
//   q1.hidden = true;
//   q2.hidden = false;
// });

getParamsForm.addEventListener("submit", initQuiz);

quiz.addEventListener("submit", processPlayerInput);

resetBtn.addEventListener("click", () => {
  window.location.reload();
});

getSaveForm.addEventListener("submit", savePlayer);

// initializePlayerDB();
