const settingsFunctionality = () => {
    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', () => {
        const workTime = document.getElementById('work-time').value;
        const breakTime = document.getElementById('break-time').value;
        let cycles = document.getElementById('number-of-cycles').value;

        if (workTime.trim() === '' || breakTime.trim() === '' || !Number.isInteger(Number(workTime)) || !Number.isInteger(Number(breakTime)) || Number(workTime) < 1 || Number(breakTime) < 1) {
            // Display error message.
            return;
        }

        const { resetSettings, saveSettings } = require('./timer.js');

        let cyclesNumber = Number(cycles.trim());

        if (isNaN(cyclesNumber) || !Number.isInteger(cyclesNumber) || cyclesNumber < 1) {
            const infiniteCycles = -1;
            cycles = infiniteCycles;
        }

        saveSettings(
            workTime * 60, 
            breakTime * 60, 
            () => (workTime * 60), 
            true, 
            workTime * 60, 
            cycles, 
            cycles);
        resetSettings();
        updateTotals();
    });
};

const updateTotals = () => {
    const settings = JSON.parse(localStorage.getItem("user_settings"));
    if (settings) {
        document.getElementById('total-work-time').innerHTML = Math.floor(settings.totalWorkTime / 60);
        document.getElementById('total-break-time').innerHTML = Math.floor(settings.totalBreakTime / 60);
        if (settings.totalCycles === -1) {
            document.getElementById('total-cycles').innerHTML = 'Infinite';
            return;
        }
        document.getElementById('total-cycles').innerHTML = settings.totalCycles;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateTotals();
    const { sideBarFunctionality } = require('./sidebar.js');
    sideBarFunctionality();
    settingsFunctionality();
});