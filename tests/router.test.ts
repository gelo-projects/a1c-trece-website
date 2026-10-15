// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initRouter, routes } from '../src/lib/router';
import type { RouterController } from '../src/lib/router';

let router: RouterController | undefined;
let scroll: ReturnType<typeof vi.fn>;
let frames: Map<number, FrameRequestCallback>;
let nextFrame: number;
function flushFrame() {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(0));
}
function click(anchor: HTMLAnchorElement, options: MouseEventInit = {}) {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...options });
  // Invoke the actual document delegate without jsdom trying to navigate URLs.
  Object.defineProperty(event, 'target', { value: anchor });
  document.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  history.replaceState({ retained: true }, '', '/');
  history.scrollRestoration = 'auto';
  document.documentElement.dataset.motion = 'full';
  document.body.innerHTML = routes.map((route) => `<a href="#${route}">${route}</a><section id="${route}"><h2 data-route-heading>${route}</h2></section>`).join('');
  scroll = vi.fn();
  HTMLElement.prototype.scrollIntoView = scroll;
  frames = new Map();
  nextFrame = 0;
  vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { frames.set(++nextFrame, callback); return nextFrame; }));
  vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => frames.delete(id)));
});

afterEach(() => {
  router?.dispose();
  router = undefined;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('section router', () => {
  it('routes a normal link, retains history state, and focuses its heading', () => {
    router = initRouter();
    const link = document.querySelector<HTMLAnchorElement>('a[href="#courses"]')!;
    expect(click(link).defaultPrevented).toBe(true);
    expect(location.hash).toBe('#courses');
    expect(history.state).toEqual({ retained: true });
    expect(router.getRoute()).toBe('courses');
    expect(link.getAttribute('aria-current')).toBe('location');
    expect(document.activeElement).toBe(document.querySelector('#courses h2'));
    expect(scroll).toHaveBeenCalledWith({ block: 'start', behavior: 'smooth' });
  });

  it.each([{ ctrlKey: true }, { metaKey: true }, { altKey: true }, { shiftKey: true }, { button: 1 }])('leaves modified clicks to the browser: %j', (options) => {
    router = initRouter();
    expect(click(document.querySelector('a[href="#courses"]')!, options).defaultPrevented).toBe(false);
    expect(location.hash).toBe('');
  });

  it.each([
    { href: 'https://outside.example/#courses' },
    { href: '/other#courses' },
    { href: '/?other=1#courses' },
    { href: '#unknown' },
    { href: '#courses', target: '_blank' },
    { href: '#courses', download: 'course.pdf' },
  ])('leaves non-router links untouched: %j', (attributes) => {
    router = initRouter();
    const anchor = document.createElement('a');
    Object.entries(attributes).forEach(([name, value]) => anchor.setAttribute(name, value));
    document.body.append(anchor);
    expect(click(anchor).defaultPrevented).toBe(false);
    expect(scroll).not.toHaveBeenCalled();
  });

  it('restores history routes once, after traversal, with instant scroll and focus', () => {
    router = initRouter();
    router.navigate('courses');
    router.navigate('visit');
    scroll.mockClear();
    history.replaceState(history.state, '', '#courses');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(history.scrollRestoration).toBe('manual');
    expect(scroll).not.toHaveBeenCalled();
    flushFrame();
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(scroll).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' });
    expect(document.activeElement).toBe(document.querySelector('#courses h2'));
    expect(router.getRoute()).toBe('courses');
  });

  it('cancels a queued history navigation when a newer link is chosen', () => {
    router = initRouter();
    history.replaceState(null, '', '#courses');
    window.dispatchEvent(new PopStateEvent('popstate'));
    router.navigate('visit');
    flushFrame();
    expect(router.getRoute()).toBe('visit');
    expect(document.activeElement).toBe(document.querySelector('#visit h2'));
  });

  it('respects reduced motion and does not steal initial deep-link focus', () => {
    document.documentElement.dataset.motion = 'reduced';
    history.replaceState(null, '', '#courses');
    router = initRouter();
    expect(document.activeElement).toBe(document.body);
    router.navigate('visit');
    expect(scroll).toHaveBeenLastCalledWith({ block: 'start', behavior: 'instant' });
    expect(document.activeElement).toBe(document.querySelector('#visit h2'));
  });

  it('cleans up queued work, links, and the previous history setting on dispose', () => {
    router = initRouter();
    history.replaceState(null, '', '#courses');
    window.dispatchEvent(new PopStateEvent('popstate'));
    router.dispose();
    flushFrame();
    expect(scroll).not.toHaveBeenCalled();
    expect(history.scrollRestoration).toBe('auto');
    expect(click(document.querySelector('a[href="#visit"]')!).defaultPrevented).toBe(false);
    router.navigate('visit');
    expect(location.hash).toBe('#courses');
  });
});
