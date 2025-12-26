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

const soundSelect = document.getElementById("sound-select");
const alertAudio = document.getElementById("alert-audio");

let timer = null;
let isRunning = false;
let mode = "pomodoro";
let timeLeft = pomodoroInput.value * 60;
let pomodoroCount = 0;

const savedSound = localStorage.getItem("pomodoroSound") || "bell1.mp3";
soundSelect.value = savedSound;
alertAudio.src = `sounds/${savedSound}`;

soundSelect.addEventListener("change", () => {
    const selectedSound = soundSelect.value;
    alertAudio.src = `sounds/${selectedSound}`;
    localStorage.setItem("pomodoroSound", selectedSound);
});

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
}

function getDuration() {
    if (mode === "pomodoro") return pomodoroInput.value * 60;
    if (mode === "shortBreak") return shortBreakInput.value * 60;
    return longBreakInput.value * 60;
}

function changeMode(newMode = null) {
    if (newMode) {
        mode = newMode;
    } else {
        if (mode === "pomodoro") {
            pomodoroCount++;
            mode = pomodoroCount % 4 === 0 ? "longBreak" : "shortBreak";
        } else {
            mode = "pomodoro";
        }
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
            changeMode();
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
    pomodoroCount = 0;
    timeLeft = pomodoroInput.value * 60;
    updateDisplay();
}

function playAlertSound() {
    alertAudio.currentTime = 0;
    alertAudio.play();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

pomodoroModeBtn.addEventListener("click", () => changeMode("pomodoro"));
shortBreakModeBtn.addEventListener("click", () => changeMode("shortBreak"));
longBreakModeBtn.addEventListener("click", () => changeMode("longBreak"));

updateDisplay();
