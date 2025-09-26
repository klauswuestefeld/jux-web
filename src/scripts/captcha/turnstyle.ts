import { backendGet } from '../api-client';

declare global {
  interface Window {
    turnstile: {
      render: (el: HTMLElement, opts: {
        sitekey: string;
        callback: (token: string) => void;
      }) => void;
    };
  }
}

type DisableBackgroundEl = HTMLElement;
type CaptchaOverlayEl = HTMLElement;

const createDisableBackground = (): DisableBackgroundEl => {
  const disableBackground = document.createElement('disable-background') as DisableBackgroundEl;
  document.body.appendChild(disableBackground);
  return disableBackground;
};

const reenableBela = (disableBackground: DisableBackgroundEl): void => {
  disableBackground.remove();
};

const ensureTurnstileScript = (): Promise<void> => new Promise((resolve, reject) => {
  const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile-script]');
  const onReady = () => (typeof window.turnstile !== 'undefined') ? resolve() : reject(new Error('Turnstile not available'));
  if (existing) {
    if (typeof window.turnstile !== 'undefined') return resolve();
    existing.addEventListener('load', onReady, { once: true });
    existing.addEventListener('error', () => reject(new Error('Failed to load Turnstile')), { once: true });
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.defer = true;
  script.dataset.turnstileScript = 'true';
  script.addEventListener('load', onReady, { once: true });
  script.addEventListener('error', () => reject(new Error('Failed to load Turnstile')), { once: true });
  document.head.appendChild(script);

  setTimeout(() => reject(new Error('Turnstile load timeout')), 15000);
});

let challengeInFlight: Promise<string> | null = null;

export const captchaChallenge = (): Promise<string> => {
  if (challengeInFlight) return challengeInFlight;

  challengeInFlight = new Promise<string>(async (resolve, reject) => {
    const disableBackground = createDisableBackground();
    let overlay: CaptchaOverlayEl | null = null;

    const cleanup = () => {
      try { overlay?.remove(); } catch {}
      try { reenableBela(disableBackground); } catch {}
      challengeInFlight = null;
    };

    try {
      await ensureTurnstileScript();

      overlay = document.createElement('captcha-overlay') as CaptchaOverlayEl;
      const container = document.createElement('turnstile-container') as HTMLElement;
      container.id = 'cf-turnstile-container';
      overlay.appendChild(container);
      document.body.appendChild(overlay);

      window.turnstile.render(container, {
        sitekey: '0x4AAAAAAB1GW9W6TaEdd7vi',
        callback: (token: string) => {
          backendGet(
            'validate-turnstile',
            { 'turnstile-token': token },
            (res: Record<string, unknown>) => {
              const sessionToken = (res as any)?.['session-token'];
              if (sessionToken) {
                try { localStorage.setItem('session-token', String(sessionToken)); } catch {}
              }
              cleanup();
              resolve(token);
            },
            (err: unknown) => {
              cleanup();
              reject(err);
            }
          );
        }
      });
    } catch (e) {
      cleanup();
      reject(e);
    }
  });

  return challengeInFlight;
};
