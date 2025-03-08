const readyButton = document.getElementById("startBtn");
const getParamsForm = document.getElementById("paramsForm");
const next1 = document.getElementById("next1");
const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");

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
