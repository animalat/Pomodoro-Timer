window.addEventListener('DOMContentLoaded', () => {
  const remote = require('@electron/remote');

  document.getElementById('close-window').addEventListener('click', () => {
    remote.getCurrentWindow().close();
  });

  document.getElementById('minimize-window').addEventListener('click', () => {
    remote.getCurrentWindow().minimize();
  });
});