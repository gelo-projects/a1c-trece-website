// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initPreferences, PREFERENCES_STORAGE_KEY } from '../src/lib/preferences';
import type { PreferencesController } from '../src/lib/preferences';

class MediaQuery extends EventTarget {
  matches = false;
  change(matches: boolean) {
    this.matches = matches;
    this.dispatchEvent(new Event('change'));
  }
}

let dark: MediaQuery;
let motion: MediaQuery;
let connection: EventTarget & { saveData: boolean };
let controller: PreferencesController | undefined;

beforeEach(() => {
  localStorage.clear();
  dark = new MediaQuery();
  motion = new MediaQuery();
  connection = Object.assign(new EventTarget(), { saveData: false });
  vi.stubGlobal('matchMedia', vi.fn((query: string) => query.includes('color-scheme') ? dark : motion));
  Object.defineProperties(navigator, {
    hardwareConcurrency: { configurable: true, value: 8 },
    deviceMemory: { configurable: true, value: 8 },
    connection: { configurable: true, value: connection },
  });
});

afterEach(() => {
  controller?.dispose();
  controller = undefined;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('browser preferences', () => {
  it.each(['broken JSON', 'null', '[]', '{"theme":"unknown","performance":99,"motion":true}'])('recovers from invalid saved settings: %s', (saved) => {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, saved);
    controller = initPreferences();
    expect(controller.getState()).toEqual({
      preferences: { theme: 'system', performance: 'auto', motion: 'system' },
      effective: { theme: 'light', performance: 'full', motion: 'full' },
    });
  });

  it('keeps working when both storage reads and writes are blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError'); });
    controller = initPreferences();
    controller.update({ theme: 'dark', performance: 'lite' });
    expect(controller.getState().effective).toEqual({ theme: 'dark', performance: 'lite', motion: 'full' });
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('follows changing OS settings while respecting an explicit theme', () => {
    controller = initPreferences();
    dark.change(true);
    motion.change(true);
    expect(controller.getState().effective).toEqual({ theme: 'dark', performance: 'full', motion: 'reduced' });
    controller.update({ theme: 'light' });
    dark.change(false);
    dark.change(true);
    expect(document.documentElement.dataset.theme).toBe('light');
    motion.change(false);
    expect(document.documentElement.dataset.motion).toBe('full');
    controller.update({ motion: 'reduced' });
    expect(document.documentElement.dataset.motion).toBe('reduced');
  });

  it.each(['cores', 'memory', 'saveData'])('automatically selects Lite from %s and permits manual Full', (hint) => {
    if (hint === 'cores') Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: 4 });
    if (hint === 'memory') Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: 2 });
    if (hint === 'saveData') connection.saveData = true;
    controller = initPreferences();
    expect(controller.getState().effective.performance).toBe('lite');
    controller.update({ performance: 'full' });
    connection.dispatchEvent(new Event('change'));
    expect(controller.getState().effective.performance).toBe('full');
    controller.update({ performance: 'auto' });
    expect(controller.getState().effective.performance).toBe('lite');
  });

  it('responds to connection and cross-tab preference changes', () => {
    controller = initPreferences();
    connection.saveData = true;
    connection.dispatchEvent(new Event('change'));
    expect(document.documentElement.dataset.performance).toBe('lite');
    window.dispatchEvent(new StorageEvent('storage', { key: PREFERENCES_STORAGE_KEY, newValue: '{"theme":"dark","performance":"full"}' }));
    expect(controller.getState().effective.theme).toBe('dark');
    expect(controller.getState().effective.performance).toBe('full');
    window.dispatchEvent(new StorageEvent('storage', { key: null }));
    expect(controller.getState().preferences.theme).toBe('system');
    expect(controller.getState().effective.performance).toBe('lite');
  });

  it('stops reacting after disposal and returns defensive state copies', () => {
    controller = initPreferences();
    controller.getState().preferences.theme = 'dark';
    expect(controller.getState().preferences.theme).toBe('system');
    controller.dispose();
    dark.change(true);
    window.dispatchEvent(new StorageEvent('storage', { key: PREFERENCES_STORAGE_KEY, newValue: '{"theme":"dark"}' }));
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(controller.update({ theme: 'dark' }).preferences.theme).toBe('system');
  });
});
