const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

const pomodoroModeBtn = document.getElementById("pomodoro-mode");
const shortBreakModeBtn = document.getElementById("short-break-mode");
const longBreakModeBtn = document.getElementById("long-break-mode");

const pomodoroInput = document.getElementById("pomodoro-time");
const shortBreakInput = document.getElementById("short-break-time");
const longBreakInput = document.getElementById("long-break-time");

const pomodoroCountEl = document.getElementById("pomodoro-count");
const progressFill = document.getElementById("progress-fill");
const resetProgressBtn = document.getElementById("reset-progress-btn");

const soundSelect = document.getElementById("sound-select");
const alertAudio = document.getElementById("alert-audio");

let timer = null;
let isRunning = false;
let mode = "pomodoro";
let pomodoroCycleCount = 0;

let completedPomodoros =
  parseInt(localStorage.getItem("completedPomodoros")) || 0;

let timeLeft = pomodoroInput.value * 60;

const savedSound = localStorage.getItem("pomodoroSound") || "bell1.mp3";
soundSelect.value = savedSound;
alertAudio.src = `sounds/${savedSound}`;

soundSelect.addEventListener("change", () => {
  alertAudio.src = `sounds/${soundSelect.value}`;
  localStorage.setItem("pomodoroSound", soundSelect.value);
});

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

function updateProgressUI() {
  pomodoroCountEl.textContent = completedPomodoros;
  const maxPomodoros = 8;
  const percent = Math.min(
    (completedPomodoros / maxPomodoros) * 100,
    100
  );
  progressFill.style.width = `${percent}%`;
}

function getDuration() {
  if (mode === "pomodoro") return pomodoroInput.value * 60;
  if (mode === "shortBreak") return shortBreakInput.value * 60;
  return longBreakInput.value * 60;
}

function playAlertSound() {
  alertAudio.currentTime = 0;
  alertAudio.play();
}

function switchMode(newMode) {
  mode = newMode;
  timeLeft = getDuration();
  updateDisplay();
}

function autoNextMode() {
  if (mode === "pomodoro") {
    completedPomodoros++;
    pomodoroCycleCount++;
    localStorage.setItem("completedPomodoros", completedPomodoros);
    updateProgressUI();
    mode = pomodoroCycleCount % 4 === 0 ? "longBreak" : "shortBreak";
  } else {
    mode = "pomodoro";
  }
  timeLeft = getDuration();
  updateDisplay();
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      playAlertSound();
      autoNextMode();
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
  pomodoroCycleCount = 0;
  timeLeft = pomodoroInput.value * 60;
  updateDisplay();
}

[pomodoroInput, shortBreakInput, longBreakInput].forEach(input => {
  input.addEventListener("change", () => {
    if (!isRunning && mode === "pomodoro") {
      timeLeft = pomodoroInput.value * 60;
      updateDisplay();
    }
  });
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

pomodoroModeBtn.addEventListener("click", () => switchMode("pomodoro"));
shortBreakModeBtn.addEventListener("click", () => switchMode("shortBreak"));
longBreakModeBtn.addEventListener("click", () => switchMode("longBreak"));

resetProgressBtn.addEventListener("click", () => {
  completedPomodoros = 0;
  localStorage.removeItem("completedPomodoros");
  updateProgressUI();
});

updateDisplay();
updateProgressUI();
