const fs = require('fs');

const saveSettings = (totalWorkTime, totalBreakTime, currentTotalTime, isWorkTime) => {
    let settings = {
        totalWorkTime: totalWorkTime,
        totalBreakTime: totalBreakTime,
        currentTotalTime: currentTotalTime,
        isWorkTime: isWorkTime
    };
    
    fs.writeFile("user_settings.json", JSON.stringify(settings), (err) => {
        if (err) throw err;
    });
}

/**
 * Initializes and starts a timer with specified work and break durations.
 * @param {number} workTimeMinutes - The work time (minutes remaining)).
 * @param {number} workTimeSeconds - The work time (seconds remaining).
 * @param {number} breakTimeMinutes - The break time (minutes remaining).
 * @param {number} breakTimeSeconds - The break time (seconds remaining).
 */
const timerDisplay = (workTimeMinutes, workTimeSeconds, breakTimeMinutes, breakTimeSeconds, totalCycles) => {
    let totalWorkTime = workTimeMinutes * 60 + workTimeSeconds;
    let totalBreakTime = breakTimeMinutes * 60 + breakTimeSeconds;
    let isWorkTime = true;

    const timerText = document.getElementById("timer-text");

    const currentTotalTime = () => {
        return isWorkTime ? totalWorkTime : totalBreakTime;
    }
    
    const updateDisplay = (seconds, minutes) => {
        timerText.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        const totalTimeRemaining = seconds + minutes * 60;
        const circumference = 2 * Math.PI * 105;
        const strokeDashOffset = circumference - (totalTimeRemaining / currentTotalTime()) * circumference;
        console.log(strokeDashOffset);
        document.documentElement.style.setProperty('--stroke-dashoffset', strokeDashOffset);
    };

    let timeRemaining = currentTotalTime();

    const timer = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        updateDisplay(seconds, minutes);
        saveSettings(totalWorkTime, totalBreakTime, currentTotalTime(), isWorkTime);

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
    sideBarFunctionality();
    timerDisplay(1, 0, 5, 0, 4);
});