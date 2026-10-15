/** Browser preferences, kept independent of the future 3D renderer. */
export type ThemePreference = 'system' | 'light' | 'dark';
export type PerformancePreference = 'auto' | 'full' | 'lite';
export type MotionPreference = 'system' | 'reduced';

export interface Preferences {
  theme: ThemePreference;
  performance: PerformancePreference;
  motion: MotionPreference;
}

export interface EffectivePreferences {
  theme: 'light' | 'dark';
  performance: 'full' | 'lite';
  motion: 'full' | 'reduced';
}

export interface PreferenceState {
  preferences: Preferences;
  effective: EffectivePreferences;
}

export interface PreferencesController {
  getState(): PreferenceState;
  update(patch: Partial<Preferences>): PreferenceState;
  dispose(): void;
}

export const PREFERENCES_STORAGE_KEY = 'a1c:preferences:v1';
export const PREFERENCES_EVENT = 'a1c:preferences';

declare global {
  interface DocumentEventMap {
    'a1c:preferences': CustomEvent<PreferenceState>;
  }
}

interface DeviceConnection extends EventTarget {
  saveData?: boolean;
}

type DeviceNavigator = Navigator & {
  deviceMemory?: number;
  connection?: DeviceConnection;
};

const defaults: Preferences = {
  theme: 'system',
  performance: 'auto',
  motion: 'system',
};

function parsePreferences(value: unknown): Preferences {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { ...defaults };
  const input = value as Record<string, unknown>;
  return {
    theme: input.theme === 'light' || input.theme === 'dark' ? input.theme : 'system',
    performance: input.performance === 'full' || input.performance === 'lite' ? input.performance : 'auto',
    motion: input.motion === 'reduced' ? 'reduced' : 'system',
  };
}

function readPreferences(serialized: string | null): Preferences {
  try {
    return parsePreferences(serialized === null ? null : JSON.parse(serialized));
  } catch {
    return { ...defaults };
  }
}

/**
 * Automatic Lite Mode is a conservative capability hint, not a benchmark.
 * Visitors may explicitly choose Full or Lite regardless of these hints.
 */
function prefersLite(device: DeviceNavigator): boolean {
  const cores = device.hardwareConcurrency;
  const memory = device.deviceMemory;
  return device.connection?.saveData === true
    || (Number.isFinite(cores) && cores > 0 && cores <= 4)
    || (typeof memory === 'number' && Number.isFinite(memory) && memory > 0 && memory <= 4);
}

function watchMedia(query: MediaQueryList, listener: () => void): () => void {
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }
  query.addListener(listener);
  return () => query.removeListener(listener);
}

/** Initialize once, before rendering the application shell. */
export function initPreferences(): PreferencesController {
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const device = window.navigator as DeviceNavigator;
  let preferences = { ...defaults };
  let disposed = false;

  // Reading localStorage itself may throw in private or restricted contexts.
  try {
    preferences = readPreferences(window.localStorage.getItem(PREFERENCES_STORAGE_KEY));
  } catch {
    // Keep the usable in-memory defaults.
  }

  const getState = (): PreferenceState => ({
    preferences: { ...preferences },
    effective: {
      theme: preferences.theme === 'system' ? (dark.matches ? 'dark' : 'light') : preferences.theme,
      performance: preferences.performance === 'auto' ? (prefersLite(device) ? 'lite' : 'full') : preferences.performance,
      motion: preferences.motion === 'reduced' || reduced.matches ? 'reduced' : 'full',
    },
  });

  const apply = (): PreferenceState => {
    const state = getState();
    const root = document.documentElement;
    root.dataset.theme = state.effective.theme;
    root.dataset.performance = state.effective.performance;
    root.dataset.motion = state.effective.motion;
    root.dataset.themePreference = state.preferences.theme;
    root.dataset.performancePreference = state.preferences.performance;
    root.dataset.motionPreference = state.preferences.motion;
    root.style.colorScheme = state.effective.theme;
    document.dispatchEvent(new CustomEvent(PREFERENCES_EVENT, { detail: state }));
    return state;
  };

  const onSystemChange = () => {
    if (!disposed) apply();
  };
  const removeDarkListener = watchMedia(dark, onSystemChange);
  const removeMotionListener = watchMedia(reduced, onSystemChange);
  device.connection?.addEventListener('change', onSystemChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== PREFERENCES_STORAGE_KEY && event.key !== null) return;
    // A storage clear or another tab's reset follows system defaults again.
    preferences = readPreferences(event.key === null ? null : event.newValue);
    apply();
  };
  window.addEventListener('storage', onStorage);
  apply();

  return {
    getState,
    update(patch) {
      if (disposed) return getState();
      preferences = parsePreferences({ ...preferences, ...patch });
      try {
        window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
      } catch {
        // Settings still apply for this page when persistence is unavailable.
      }
      return apply();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      removeDarkListener();
      removeMotionListener();
      device.connection?.removeEventListener('change', onSystemChange);
      window.removeEventListener('storage', onStorage);
    },
  };
}
