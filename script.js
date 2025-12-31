const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

const pomodoroBtn = document.getElementById("pomodoro-mode");
const shortBtn = document.getElementById("short-break-mode");
const longBtn = document.getElementById("long-break-mode");

const pomodoroInput = document.getElementById("pomodoro-time");
const shortInput = document.getElementById("short-break-time");
const longInput = document.getElementById("long-break-time");

const soundSelect = document.getElementById("sound-select");
const alertAudio = document.getElementById("alert-audio");

const pomodoroCountEl = document.getElementById("pomodoro-count");
const progressFill = document.getElementById("progress-fill");
const resetProgressBtn = document.getElementById("reset-progress-btn");

let timer = null;
let isRunning = false;
let mode = "pomodoro";
let pomodoroCycle = 0;

let completedPomodoros = parseInt(localStorage.getItem("completedPomodoros")) || 0;

const savedSound = localStorage.getItem("pomodoroSound") || "bell1.mp3";
soundSelect.value = savedSound;
alertAudio.src = `sounds/${savedSound}`;

function getDuration() {
    if (mode === "pomodoro") return pomodoroInput.value * 60;
    if (mode === "shortBreak") return shortInput.value * 60;
    return longInput.value * 60;
}

let timeLeft = getDuration();

function updateDisplay() {
    minutesEl.textContent = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    secondsEl.textContent = String(timeLeft % 60).padStart(2, "0");
}

function updateProgress() {
    pomodoroCountEl.textContent = completedPomodoros;
    progressFill.style.width = Math.min((completedPomodoros / 8) * 100, 100) + "%";
}

function playSound() {
    alertAudio.currentTime = 0;
    alertAudio.play();
}

function setMode(newMode) {
    clearInterval(timer);
    isRunning = false;
    mode = newMode;
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
            playSound();

            if (mode === "pomodoro") {
                completedPomodoros++;
                localStorage.setItem("completedPomodoros", completedPomodoros);
                updateProgress();
                pomodoroCycle++;
                mode = pomodoroCycle % 4 === 0 ? "longBreak" : "shortBreak";
            } else {
                mode = "pomodoro";
            }

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
    pomodoroCycle = 0;
    timeLeft = getDuration();
    updateDisplay();
}

soundSelect.addEventListener("change", () => {
    alertAudio.src = `sounds/${soundSelect.value}`;
    localStorage.setItem("pomodoroSound", soundSelect.value);
});

[pomodoroInput, shortInput, longInput].forEach(input => {
    input.addEventListener("change", () => {
        if (!isRunning) {
            timeLeft = getDuration();
            updateDisplay();
        }
    });
});

pomodoroBtn.addEventListener("click", () => setMode("pomodoro"));
shortBtn.addEventListener("click", () => setMode("shortBreak"));
longBtn.addEventListener("click", () => setMode("longBreak"));

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

resetProgressBtn.addEventListener("click", () => {
    completedPomodoros = 0;
    localStorage.removeItem("completedPomodoros");
    updateProgress();
});

updateDisplay();
updateProgress();
