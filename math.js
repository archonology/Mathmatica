// document.body.onload = addElement;

// function addElement() {
//   // create a new div element
newButton = document.createElement("button");
newButton.id = "leaderBtn";

// and give it some content
const newContent = document.createTextNode("Show Leaderboard");

// add the text node to the newly created div
newButton.appendChild(newContent);

// add the newly created element and its content into the DOM
const currentBtn = document.getElementById("startbtn");
document.body.insertBefore(newButton, currentBtn);
const leaderBtn = document.getElementById("leaderBtn");
// }

function toggleLeader() {
  console.log(leaderBtn.textContent);
  leaderBtn.textContent === "Show Leaderboard"
    ? (leaderBtn.textContent = "Hide Leaderboard")
    : (leaderBtn.textContent = "Show Leaderboard");
}

newButton.addEventListener("click", toggleLeader);
