const path = require('path');

// Toggles sidebar when toggle-btn is clicked. Starts with sidebar closed.
const sideBarFunctionality = () => {
    const toggleSidebar = () => {
        document.querySelector('.sidebar').classList.toggle('close');
    };

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
};

document.addEventListener('DOMContentLoaded', () => {
    sideBarFunctionality();
    // console.log('Sidebar page loaded');
});

module.exports = { sideBarFunctionality };