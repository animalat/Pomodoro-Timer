document.addEventListener('DOMContentLoaded', () => {
    console.log('Settings page loaded');
    
    const { sideBarFunctionality } = require('./sidebar.js');
    sideBarFunctionality();
});