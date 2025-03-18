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
    initials,
    _id
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
    this._id = _id;
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
// IndexedDB Helper Functions

const dbName = "playerDB";
const storeName = "playerStore";

async function saveObjectToIndexedDB(object) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

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

// save to indexedDB and localStorage:
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

//Retrieving from local storage.
function getObjectFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error retrieving from local storage:", error);
    return null;
  }
}

//Retrieving from indexedDB.
async function getObjectFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const getRequest = store.get(key);

      getRequest.onsuccess = (event) => {
        resolve(event.target.result);
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

// basic retrieve usage
async function getLeaderboardData() {
  try {
    const retrievedLocalStorage = getObjectFromLocalStorage("lastPlayer");
    console.log("Retrieved from local storage: ", retrievedLocalStorage);

    const retrievedIndexedDB = await getObjectFromIndexedDB(1); //Assuming the first object saved had key 1.
    console.log("Retrieved from IndexedDB: ", retrievedIndexedDB);
  } catch (error) {
    console.error("Error retrieving: ", error);
  }
}

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
  saveToDB(newPlayer);
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

// request.onupgradeneeded = (event) => {
//   db = event.target.result;
//   const objectStore = db.createObjectStore("players", {
//     keyPath: "_id",
//     autoIncrement: true,
//   });
//   objectStore.createIndex("_id", "_id", { unique: true });
//   request.onsuccess = (event) => {
//     db = event.target.result;
//   };
// };
// openIndexedDB("playerDB", 1, "playerStore");
