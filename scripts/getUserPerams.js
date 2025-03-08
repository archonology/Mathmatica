const readyButton = document.getElementById("startBtn");
const getParamsForm = document.getElementById("paramsForm");

// handle revealing the user params form and hiding the start test button
readyButton.addEventListener(
  "click",
  () => {
    getParamsForm.hidden = false;
    readyButton.hidden = true;
  }
  //   false
);
