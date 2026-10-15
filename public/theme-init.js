// Apply only the initial color scheme before paint; the typed controller owns subsequent updates.
(() => {
  let preference = 'system';
  try {
    const saved = JSON.parse(localStorage.getItem('a1c:preferences:v1') || 'null');
    if (saved?.theme === 'light' || saved?.theme === 'dark') preference = saved.theme;
  } catch { /* Storage may be disabled. Follow the device. */ }
  const dark = preference === 'dark' || (preference === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
})();
