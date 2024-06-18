document.addEventListener('DOMContentLoaded', () => {
    // Close sidebar to start.
    document.querySelector('.sidebar').classList.toggle('close');

    document.getElementById('toggle-btn').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('close');
    });
});