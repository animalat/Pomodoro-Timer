const { clear } = require('console');
const fs = require('fs');
const { start } = require('repl');
const path = require('path');

/**
 * @param {number} totalWorkTime - The total work time in minutes.
 * @param {number} totalBreakTime - The total break time in minutes.
 * @param {function} currentTotalTime - A function that returns the current total time in seconds.
 * @param {boolean} isWorkTime - Whether the timer is currently in work time.
 * @param {number} timeRemaining - The time remaining in the current cycle.
 * @param {number} cyclesRemaining - The total number of cycles left to complete.
 * @param {number} totalCycles - The total number of cycles to complete.
*/
const saveSettings = (totalWorkTime, totalBreakTime, currentTotalTime, isWorkTime, timeRemaining, cyclesRemaining, totalCycles) => {
    let settings = {
        totalWorkTime,
        totalBreakTime,
        currentTotalTime: currentTotalTime(),
        isWorkTime,
        timeRemaining,
        cyclesRemaining,
        totalCycles
    };
    
    localStorage.setItem("user_settings", JSON.stringify(settings));
};

const loadSettings = () => {
    const settings = JSON.parse(localStorage.getItem("user_settings"));
    if (settings) {
        timerDisplay(settings.totalWorkTime / 60, settings.totalWorkTime % 60, settings.totalBreakTime / 60, settings.totalBreakTime % 60, settings.cyclesRemaining, settings.totalCycles, settings.timeRemaining, settings.isWorkTime);
    } else {
        // Default settings.
        timerDisplay(25, 0, 5, 0, 4);
    }
};

const startStopButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");

let timerRunning = false;
let timerInterval = null;

const startTimer = () => {
    if (!timerRunning) {
        timerRunning = true;
        startStopButton.textContent = "Pause";
        resetButton.style.opacity = '1';
        resetButton.style.cursor = 'pointer';
        loadSettings();
    }
};

const pauseTimer = () => {
    if (timerRunning) {
        clearInterval(timerInterval); // Assuming timerInterval is your setInterval ID for the timer
        timerRunning = false;
        startStopButton.textContent = "Resume";
    }
};

const resetSettings = () => {
    const settings = JSON.parse(localStorage.getItem("user_settings"));
    settings.timeRemaining = settings.currentTotalTime;
    settings.cyclesRemaining = settings.totalCycles;
    saveSettings(
        settings.totalWorkTime, 
        settings.totalBreakTime, 
        () => settings.totalWorkTime, 
        settings.isWorkTime, 
        settings.timeRemaining, 
        settings.totalCycles,
        settings.totalCycles
    );
};

const resetTimer = () => {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
    }

    timerRunning = false;
    startStopButton.textContent = "Start";
    resetSettings();
    document.querySelector('.timer').classList.remove('fade-in');
    document.querySelector('circle').classList.remove('fade-in');
    
    resetButton.style.opacity = 0;
    resetButton.style.cursor = 'default';
};

/**
 * Initializes and starts a timer with specified work and break durations.
 * @param {number} workTimeMinutes - The work time (minutes remaining)).
 * @param {number} workTimeSeconds - The work time (seconds remaining).
 * @param {number} breakTimeMinutes - The break time (minutes remaining).
 * @param {number} breakTimeSeconds - The break time (seconds remaining).
 * @param {number} cyclesRemaining - The total number of cycles to complete.
 * @param {number} totalCycles - The total number of cycles to complete.
 * @param {number} timeRemaining - The time remaining in the current cycle.
 * @param {boolean} isWorkTime - Whether the timer is currently in work time.
 */
const timerDisplay = (workTimeMinutes, workTimeSeconds, breakTimeMinutes, breakTimeSeconds, cyclesRemaining, totalCycles, timeRemaining = null, isWorkTime = true) => {
    let totalWorkTime = workTimeMinutes * 60 + workTimeSeconds;
    let totalBreakTime = breakTimeMinutes * 60 + breakTimeSeconds;

    const timerText = document.getElementById("timer-text");

    const currentTotalTime = () => {
        return isWorkTime ? totalWorkTime : totalBreakTime;
    }
    
    const updateDisplay = (seconds, minutes) => {
        timerText.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        document.querySelector('.timer').classList.add('fade-in');
        document.querySelector('circle').classList.add('fade-in');

        const totalTimeRemaining = seconds + minutes * 60;
        const circumference = 2 * Math.PI * 105;
        const strokeDashOffset = circumference - (totalTimeRemaining / currentTotalTime()) * circumference;
        // console.log(strokeDashOffset);
        document.documentElement.style.setProperty('--stroke-dashoffset', strokeDashOffset);
    };

    if (timeRemaining === null) {
        timeRemaining = currentTotalTime();
    }

    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        updateDisplay(seconds, minutes);
        saveSettings(totalWorkTime, totalBreakTime, currentTotalTime, isWorkTime, timeRemaining, cyclesRemaining, totalCycles);

        if (timeRemaining > 0) {
            timeRemaining--;
        } else {
            isWorkTime = !isWorkTime;
            if (isWorkTime && cyclesRemaining > 0) {
                cyclesRemaining--;
            }
            if (cyclesRemaining === 0) {
                clearInterval(timerInterval);
                timerText.textContent = "0:00";
                return;
            }
            timeRemaining = isWorkTime ? totalWorkTime : totalBreakTime;
        }
    }, 1000);
};

const startStopButtonListen = () => {
    startStopButton.addEventListener('click', () => {
        if (timerRunning) {
            // console.log('Pausing timer');
            pauseTimer();
        } else {
            // console.log('Starting timer');
            startTimer();
        }
    });

    resetButton.addEventListener('click', () => {
        if (resetButton.style.opacity === '1') {
            // console.log('Resetting timer');
            resetTimer();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    startStopButtonListen();
    const { sideBarFunctionality } = require('./sidebar.js');
    sideBarFunctionality();
});

module.exports = { saveSettings, resetSettings };