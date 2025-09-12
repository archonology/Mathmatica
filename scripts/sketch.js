const openBtn = document.getElementById("open-window-btn");
const closeBtn = document.getElementById("close-window-btn");
const sketchWindow = document.getElementById("sketch-window");
const canvas = document.getElementById("drawing-canvas");

// Dragging the Window ---------------------------------------
const header = document.getElementById("window-header");
let isDragging = false;
let startX, startY;
let initialX, initialY;

// Basic Sketching Interface ------------------------------
const ctx = canvas.getContext("2d");
let isDrawing = false;

// Set drawing style
ctx.lineWidth = 4;
ctx.lineCap = "round";
ctx.strokeStyle = "#333";

// Event listeners for drawing
const drawEvents = {
  start: ["mousedown", "touchstart"],
  move: ["mousemove", "touchmove"],
  end: ["mouseup", "touchend"],
};

function getEventPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

drawEvents.start.forEach((event) => {
  canvas.addEventListener(event, (e) => {
    e.preventDefault(); // Prevents touch scrolling
    isDrawing = true;
    const { x, y } = getEventPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  });
});

drawEvents.move.forEach((event) => {
  canvas.addEventListener(event, (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getEventPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  });
});

drawEvents.end.forEach((event) => {
  document.addEventListener(event, () => {
    if (isDrawing) {
      isDrawing = false;
      ctx.closePath();
    }
  });
});

openBtn.addEventListener("click", () => {
  sketchWindow.classList.remove("hidden");
  // Resize the canvas to fit its container
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

closeBtn.addEventListener("click", () => {
  sketchWindow.classList.add("hidden");
});

// Normalize events for both mouse and touch
const events = {
  start: ["mousedown", "touchstart"],
  move: ["mousemove", "touchmove"],
  end: ["mouseup", "touchend"],
};

events.start.forEach((event) => {
  header.addEventListener(event, (e) => {
    isDragging = true;
    // Check if it's a touch event and get the first touch point
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;
    initialX = sketchWindow.offsetLeft;
    initialY = sketchWindow.offsetTop;

    sketchWindow.style.transition = "none"; // Disable transition while dragging
  });
});

events.move.forEach((event) => {
  document.addEventListener(event, (e) => {
    if (!isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    sketchWindow.style.left = `${initialX + deltaX}px`;
    sketchWindow.style.top = `${initialY + deltaY}px`;
  });
});

events.end.forEach((event) => {
  document.addEventListener(event, () => {
    isDragging = false;
    sketchWindow.style.transition = ""; // Re-enable transition
  });
});
