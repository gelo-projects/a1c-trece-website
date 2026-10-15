/** Native section routing; deployment paths remain the host's responsibility. */
export const routes = ['home', 'courses', 'experience', 'visit'] as const;
export type RouteId = typeof routes[number];
export type NavigationSource = 'initial' | 'link' | 'history' | 'programmatic';

export interface NavigationDetail {
  route: RouteId;
  source: NavigationSource;
}

export interface NavigateOptions {
  replace?: boolean;
  focus?: boolean;
  behavior?: ScrollBehavior;
}

export interface RouterController {
  getRoute(): RouteId;
  navigate(route: RouteId, options?: NavigateOptions): void;
  dispose(): void;
}

declare global {
  interface DocumentEventMap {
    'a1c:navigate': CustomEvent<NavigationDetail>;
  }
}

function parseRoute(hash: string): RouteId | null {
  const candidate = hash.replace(/^#/, '');
  return routes.includes(candidate as RouteId) ? candidate as RouteId : null;
}

export function initRouter(): RouterController {
  let current: RouteId = parseRoute(window.location.hash) ?? 'home';
  let lastHash = window.location.hash;
  let disposed = false;
  let historyFrame: number | null = null;
  const previousScrollRestoration = window.history.scrollRestoration;
  window.history.scrollRestoration = 'manual';

  const cancelHistoryNavigation = () => {
    if (historyFrame === null) return;
    window.cancelAnimationFrame(historyFrame);
    historyFrame = null;
  };

  const updateLinks = () => {
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
      const route = parseRoute(link.hash);
      if (!route) return;
      if (route === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const show = (route: RouteId, source: NavigationSource, options: NavigateOptions = {}) => {
    const section = document.getElementById(route);
    if (!section) return;
    current = route;
    updateLinks();
    const motionReduced = document.documentElement.dataset.motion === 'reduced';
    section.scrollIntoView({
      behavior: motionReduced ? 'instant' : options.behavior ?? 'smooth',
      block: 'start',
    });
    if (options.focus !== false) {
      const target = section.querySelector<HTMLElement>('[data-route-heading], h1, h2') ?? section;
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    document.dispatchEvent(new CustomEvent<NavigationDetail>('a1c:navigate', { detail: { route, source } }));
  };

  const navigate = (route: RouteId, options: NavigateOptions = {}, source: NavigationSource = 'programmatic') => {
    if (disposed || !routes.includes(route) || !document.getElementById(route)) return;
    cancelHistoryNavigation();
    const hash = `#${route}`;
    if (window.location.hash !== hash) {
      // Preserve any state supplied by a future journey-restoration controller.
      if (options.replace) window.history.replaceState(window.history.state, '', hash);
      else window.history.pushState(window.history.state, '', hash);
    }
    lastHash = hash;
    show(route, source, options);
  };

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin
      || destination.pathname !== window.location.pathname
      || destination.search !== window.location.search) return;
    const route = parseRoute(destination.hash);
    if (!route || !document.getElementById(route)) return;
    event.preventDefault();
    navigate(route, {}, 'link');
  };

  const onHistory = () => {
    if (window.location.hash === lastHash) return;
    lastHash = window.location.hash;
    const route = parseRoute(lastHash) ?? (lastHash === '' ? 'home' : null);
    cancelHistoryNavigation();
    if (route) {
      // Wait until traversal finishes so native history focus/scroll restoration
      // cannot overwrite the section heading chosen by the router.
      historyFrame = window.requestAnimationFrame(() => {
        historyFrame = null;
        if (!disposed) show(route, 'history', { behavior: 'instant' });
      });
    }
  };

  document.addEventListener('click', onClick);
  window.addEventListener('popstate', onHistory);
  window.addEventListener('hashchange', onHistory);
  updateLinks();
  if (parseRoute(window.location.hash)) show(current, 'initial', { focus: false, behavior: 'instant' });

  return {
    getRoute: () => current,
    navigate,
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelHistoryNavigation();
      window.history.scrollRestoration = previousScrollRestoration;
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onHistory);
      window.removeEventListener('hashchange', onHistory);
    },
  };
}
