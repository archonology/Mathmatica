const leadBtn = document.getElementById("leaderBtn");

function toggleLeader() {
  leadBtn.textContent === "Show Leaderboard"
    ? (leadBtn.textContent = "Hide Leaderboard")
    : (leadBtn.textContent = "Show Leaderboard");
}

// listen for the leaderboard button click
leadBtn.addEventListener("click", toggleLeader);
