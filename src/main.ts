import '@fontsource-variable/dm-sans/standard.css';
import './styles/main.css';
import { initPreferences } from './lib/preferences';
import type { PreferenceState, Preferences } from './lib/preferences';
import { initRouter } from './lib/router';
import { branch } from './content/branch';

const preferences = initPreferences();
const router = initRouter();
const menu = document.querySelector<HTMLDialogElement>('#menu-dialog')!;
const review = document.querySelector<HTMLDialogElement>('#review-dialog')!;
const themeButton = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')!;
let lastMenuTrigger: HTMLElement | null = null;

function openDialog(dialog: HTMLDialogElement, trigger: HTMLElement) {
  lastMenuTrigger = trigger;
  dialog.returnValue = '';
  dialog.showModal();
  dialog.querySelector<HTMLElement>('button')?.focus();
}

document.querySelector<HTMLElement>('[data-menu-open]')!.addEventListener('click', event => openDialog(menu, event.currentTarget as HTMLElement));
document.querySelector<HTMLElement>('[data-review-open]')!.addEventListener('click', event => openDialog(review, event.currentTarget as HTMLElement));
document.querySelectorAll('[data-menu-close]').forEach(button => button.addEventListener('click', () => menu.close()));
document.querySelectorAll('[data-review-close]').forEach(button => button.addEventListener('click', () => review.close()));

for (const dialog of [menu, review]) {
  dialog.addEventListener('close', () => { if (dialog.returnValue !== 'navigate') lastMenuTrigger?.focus({preventScroll:true}); });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const items = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]')).filter(element => {
      if (element.getClientRects().length === 0) return false;
      if (element instanceof HTMLInputElement && element.type === 'radio') {
        return element.checked || !dialog.querySelector(`input[name="${element.name}"]:checked`);
      }
      return true;
    });
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
}

menu.querySelectorAll<HTMLAnchorElement>('nav a').forEach(link => link.addEventListener('click', () => menu.close('navigate')));

function syncPreferences(state: PreferenceState) {
  for (const [key, value] of Object.entries(state.preferences)) {
    const input = document.querySelector<HTMLInputElement>(`input[name="${key}"][value="${value}"]`);
    if (input) input.checked = true;
  }
  const dark = state.effective.theme === 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeButton.title = `Switch to ${dark ? 'light' : 'dark'} theme`;
  themeButton.innerHTML = dark
    ? '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" stroke="currentColor" stroke-width="1.5"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z" stroke="currentColor" stroke-width="1.5"/></svg>';
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content = dark ? '#0C1424' : '#F2F0E9';
  document.querySelector('#effective-status')!.textContent = `Currently: ${state.effective.theme} appearance · ${state.effective.performance === 'lite' ? 'Lite Mode' : 'full detail'} · ${state.effective.motion === 'reduced' ? 'reduced motion' : 'standard motion'}.`;
}

document.addEventListener('a1c:preferences', event => syncPreferences(event.detail));
syncPreferences(preferences.getState());
themeButton.addEventListener('click', () => preferences.update({theme: preferences.getState().effective.theme === 'dark' ? 'light' : 'dark'}));
menu.addEventListener('change', event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (!['theme','performance','motion'].includes(input.name)) return;
  preferences.update({[input.name]: input.value} as Partial<Preferences>);
});

// No duplicated operational content. All five verified service names come from one source.
document.querySelector('#course-list')!.innerHTML = branch.courses.map((course, index) => `<div class="course-row"><span class="course-index">0${index + 1}</span><div><span class="course-category">${course.category === 'theory' ? 'THEORY' : 'PRACTICAL'}</span><h3>${course.name}</h3></div><span class="course-mark" aria-hidden="true"></span></div>`).join('');

// Preserve a readable identity even when an image request fails.
const logo = document.querySelector<HTMLImageElement>('[data-logo]')!;
const useTextIdentity = () => {
  logo.hidden = true;
  document.querySelector<HTMLElement>('[data-brand-fallback]')!.hidden = false;
};
logo.addEventListener('error', useTextIdentity);
if (logo.complete && logo.naturalWidth === 0) useTextIdentity();

if (import.meta.hot) import.meta.hot.dispose(() => {preferences.dispose();router.dispose();});
