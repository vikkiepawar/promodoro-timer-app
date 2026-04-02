const timeEl = document.getElementById("time");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

const modeButtons = document.querySelectorAll(".mode");

const pomodoroInput = document.getElementById("pomodoro-time");
const shortInput = document.getElementById("short-break-time");
const longInput = document.getElementById("long-break-time");

const soundSelect = document.getElementById("sound-select");
const alertAudio = document.getElementById("alert-audio");

const pomodoroCountEl = document.getElementById("pomodoro-count");
const progressBar = document.getElementById("progress-bar");
const resetProgressBtn = document.getElementById("reset-progress-btn");

let timer = null;
let isRunning = false;
let mode = "pomodoro";
let cycle = 0;

let completedPomodoros = parseInt(localStorage.getItem("completedPomodoros")) || 0;

let audioUnlocked = false;

// INIT
soundSelect.value = localStorage.getItem("pomodoroSound") || "bell1.mp3";
alertAudio.src = "sounds/" + soundSelect.value;

// FUNCTIONS
function getDuration() {
  if (mode === "pomodoro") return pomodoroInput.value * 60;
  if (mode === "short") return shortInput.value * 60;
  return longInput.value * 60;
}

let timeLeft = getDuration();

function updateDisplay() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  timeEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updateProgress() {
  pomodoroCountEl.textContent = completedPomodoros;
  progressBar.value = Math.min(completedPomodoros, 4);
}

function unlockAudio() {
  if (!audioUnlocked) {
    alertAudio.play().then(() => {
      alertAudio.pause();
      alertAudio.currentTime = 0;
      audioUnlocked = true;
    }).catch(() => {});
  }
}

function playSound() {
  if (!audioUnlocked) return;
  alertAudio.currentTime = 0;
  alertAudio.play().catch(() => {});
}

function setActiveMode() {
  modeButtons.forEach(btn =>
    btn.classList.toggle("active", btn.dataset.mode === mode)
  );
}

function setMode(newMode) {
  clearInterval(timer);
  isRunning = false;
  mode = newMode;
  timeLeft = getDuration();
  setActiveMode();
  updateDisplay();
}

function startTimer() {
  if (isRunning) return;

  unlockAudio();
  isRunning = true;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;

      playSound();

      if (mode === "pomodoro") {
        completedPomodoros++;
        localStorage.setItem("completedPomodoros", completedPomodoros);
        updateProgress();
        cycle++;
        mode = cycle % 4 === 0 ? "long" : "short";
      } else {
        mode = "pomodoro";
      }

      setActiveMode();
      timeLeft = getDuration();
      updateDisplay();
      startTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  mode = "pomodoro";
  cycle = 0;
  setActiveMode();
  timeLeft = getDuration();
  updateDisplay();
}

// EVENTS
modeButtons.forEach(btn => {
  btn.addEventListener("click", () => setMode(btn.dataset.mode));
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

resetProgressBtn.addEventListener("click", () => {
  completedPomodoros = 0;
  localStorage.removeItem("completedPomodoros");
  updateProgress();
});

[pomodoroInput, shortInput, longInput].forEach(input => {
  input.addEventListener("change", () => {
    localStorage.setItem(input.id, input.value);
    if (!isRunning) {
      timeLeft = getDuration();
      updateDisplay();
    }
  });
});

soundSelect.addEventListener("change", () => {
  alertAudio.src = "sounds/" + soundSelect.value;
  localStorage.setItem("pomodoroSound", soundSelect.value);
});

// LOAD
window.addEventListener("load", () => {
  pomodoroInput.value = localStorage.getItem("pomodoro-time") || 25;
  shortInput.value = localStorage.getItem("short-break-time") || 5;
  longInput.value = localStorage.getItem("long-break-time") || 15;

  updateDisplay();
  updateProgress();
  setActiveMode();
});