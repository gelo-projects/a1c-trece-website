import type { EffectivePreferences } from './preferences';

/** Types only: actual scenes begin after Phase 1 approval. */
export interface SceneContext {
  container: HTMLElement;
  preferences: EffectivePreferences;
  /** Aborted when a lazy scene load is no longer needed. */
  signal: AbortSignal;
}

/**
 * A later Three.js scene owns its renderer, models, textures and event listeners.
 * Text and actions remain in semantic HTML outside the scene container.
 */
export interface SceneController {
  /** Normalized position within this scene, clamped by the journey controller. */
  setProgress(progress: number): void;
  /** Pause rendering when hidden, offscreen or the document is in the background. */
  pause(): void;
  resume(): void;
  setTheme(theme: EffectivePreferences['theme']): void;
  setPerformance(performance: EffectivePreferences['performance']): void;
  setMotion(motion: EffectivePreferences['motion']): void;
  resize(width: number, height: number, pixelRatio: number): void;
  /** Release GPU resources and detach all scene-owned browser listeners. */
  dispose(): void;
}

/** The future scene module is loaded dynamically only when approaching its section. */
export interface SceneModule {
  init(context: SceneContext): Promise<SceneController>;
}
