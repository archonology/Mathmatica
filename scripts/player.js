const getRecord = document.querySelector(".rec");
const recArm = document.getElementById("rec_arm");
const record = new Audio("./assets/SBJBeat.mp3");
const scratch = new Audio("./assets/scratch.mp3");

var playing = false;
let intervalID;
let countAlong = 1;

// handle the delay in stopping the record spin
function countAlonger() {
  if (countAlong > 0) {
    countAlong--;
  } else {
    getRecord.setAttribute("class", "rec");
    clearInterval(intervalID);
    // set the intervalID to null to prevent the time from init
    intervalID = null;
    playing = false;
  }
}

function handleVinyl(e) {
  e.preventDefault();
  if (playing == false) {
    // handle sliding the record player arm in
    recArm.style.right = "1rem";
    record.play();
    // append the clicked class that spins the record icon.
    getRecord.setAttribute("class", "rec clicked");
    playing = true;
  } else {
    recArm.setAttribute("class", "arm_click");
    // recArm.style.right = "-150%";
    record.pause();
    scratch.play();
    // make the record stop a bit slower with the scratch sound effect on stop.
    intervalID ??= setInterval(countAlonger, 500);
  }
}

getRecord.addEventListener("click", (e) => handleVinyl(e));
// the record arm covers the record during playback (z-index)
recArm.addEventListener("click", (e) => handleVinyl(e));
