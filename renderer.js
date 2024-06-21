const fs = require('fs');

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
        document.documentElement.style.setProperty('--visibility', 'visible');

        const totalTimeRemaining = seconds + minutes * 60;
        const circumference = 2 * Math.PI * 105;
        const strokeDashOffset = circumference - (totalTimeRemaining / currentTotalTime()) * circumference;
        console.log(strokeDashOffset);
        document.documentElement.style.setProperty('--stroke-dashoffset', strokeDashOffset);
    };

    if (timeRemaining === null) {
        timeRemaining = currentTotalTime();
    }

    const timer = setInterval(() => {
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
                clearInterval(timer);
                timerText.textContent = "0:00";
                return;
            }
            timeRemaining = isWorkTime ? totalWorkTime : totalBreakTime;
        }
    }, 1000);
}

// Toggles the sidebar.
const toggleSidebar = () => {
    document.querySelector('.sidebar').classList.toggle('close');
}

// Toggles sidebar when toggle-btn is clicked. Starts with sidebar closed.
const sideBarFunctionality = () => {
    // Toggle at first.
    toggleSidebar();
    document.getElementById('toggle-btn').addEventListener('click', () => {
        toggleSidebar();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    sideBarFunctionality();
});