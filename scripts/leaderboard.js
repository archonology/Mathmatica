//create the leaderboard button
const newButton = document.createElement("button");
const newBreak = document.createElement("br");
newButton.id = "leaderBtn";
newButton.className = "minorBtn";

// and give it some content
const newContent = document.createTextNode("Show Leaderboard");

// add the text node to the newly created button
newButton.appendChild(newContent);

// add the newly created element and its content into the DOM
const currentBtn = document.getElementById("resetBtn");
document.body.insertBefore(newButton, currentBtn);
document.body.insertBefore(newBreak, currentBtn);

// toggle the Hide and Show Leaderboard text, and eventually the commands to show or hide the leaderboard.
function toggleLeader() {
  console.log(leaderBtn.textContent);
  leaderBtn.textContent === "Show Leaderboard"
    ? (leaderBtn.textContent = "Hide Leaderboard")
    : (leaderBtn.textContent = "Show Leaderboard");
}

// listen for the leaderboard button click
newButton.addEventListener("click", toggleLeader);
