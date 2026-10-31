// Loaded before app modules, so module/network failures leave a recoverable screen.
(() => {
  const screen = document.querySelector('#startup');
  const retry = document.querySelector('#bootRetry');
  retry.addEventListener('click', () => location.reload());
  window.astraxStartupFailure = (message) => {
    if (!screen || screen.hidden || screen.classList.contains('is-leaving')) return;
    document.querySelector('#bootMessage').textContent = message;
    document.querySelector('#bootProgress').hidden = true;
    document.querySelector('#bootTitle').textContent = 'Let’s try that again.';
    screen.classList.add('has-error');
    retry.hidden = false;
  };
  window.addEventListener('error', event => {
    if (event.error || event.target?.tagName === 'SCRIPT') window.astraxStartupFailure('A launcher component could not load. Check your connection and retry.');
  }, true);
  window.addEventListener('unhandledrejection', () => window.astraxStartupFailure('The workspace could not start. Reload to try again.'));
})();
