const { clear } = require('console');
const fs = require('fs');
const { start } = require('repl');

const saveSettings = (totalWorkTime, totalBreakTime, currentTotalTime, isWorkTime, timeRemaining, totalCycles) => {
    let settings = {
        totalWorkTime,
        totalBreakTime,
        currentTotalTime: currentTotalTime(),
        isWorkTime,
        timeRemaining,
        totalCycles
    };
    
    localStorage.setItem("user_settings", JSON.stringify(settings));
};

const loadSettings = () => {
    const settings = JSON.parse(localStorage.getItem("user_settings"));
    if (settings) {
        timerDisplay(settings.totalWorkTime / 60, settings.totalWorkTime % 60, settings.totalBreakTime / 60, settings.totalBreakTime % 60, settings.totalCycles, settings.timeRemaining, settings.isWorkTime);
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

const resetTimer = () => {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
    }

    timerRunning = false;
    startStopButton.textContent = "Start";
    
    const settings = JSON.parse(localStorage.getItem("user_settings"));
    settings.timeRemaining = settings.currentTotalTime;
    saveSettings(
        settings.totalWorkTime, 
        settings.totalBreakTime, 
        () => settings.totalWorkTime, 
        settings.isWorkTime, 
        settings.timeRemaining, 
        settings.totalCycles
    );
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
 */
const timerDisplay = (workTimeMinutes, workTimeSeconds, breakTimeMinutes, breakTimeSeconds, totalCycles, timeRemaining = null, isWorkTime = true) => {
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
        console.log(strokeDashOffset);
        document.documentElement.style.setProperty('--stroke-dashoffset', strokeDashOffset);
    };

    if (timeRemaining === null) {
        timeRemaining = currentTotalTime();
    }

    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        updateDisplay(seconds, minutes);
        saveSettings(totalWorkTime, totalBreakTime, currentTotalTime, isWorkTime, timeRemaining, totalCycles);

        if (timeRemaining > 0) {
            timeRemaining--;
        } else {
            isWorkTime = !isWorkTime;
            if (isWorkTime) {
                totalCycles--;
            }
            if (totalCycles === 0) {
                clearInterval(timerInterval);
                timerText.textContent = "0:00";
                return;
            }
            timeRemaining = isWorkTime ? totalWorkTime : totalBreakTime;
        }
    }, 1000);
}

// Toggles sidebar when toggle-btn is clicked. Starts with sidebar closed.
const sideBarFunctionality = () => {
    const toggleSidebar = () => {
        document.querySelector('.sidebar').classList.toggle('close');
    }

    // Toggle at first.
    toggleSidebar();

    document.getElementById('toggle-btn').addEventListener('click', (event) => {
        toggleSidebar();
        event.stopPropagation(); // Prevents the click from propagating to the document level when the button is clicked.
    });

    document.addEventListener('click', (event) => {
        const sidebar = document.querySelector('.sidebar');
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isSidebarOpen = !sidebar.classList.contains('close');

        if (isSidebarOpen && !isClickInsideSidebar) {
            toggleSidebar();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    startStopButton.addEventListener('click', () => {
        if (timerRunning) {
            console.log('Pausing timer');
            pauseTimer();
        } else {
            console.log('Starting timer');
            startTimer();
        }
    });

    resetButton.addEventListener('click', () => {
        if (resetButton.style.opacity === '1') {
            console.log('Resetting timer');
            resetTimer();
        }
    });

    sideBarFunctionality();
});