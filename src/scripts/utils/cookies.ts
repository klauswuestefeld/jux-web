let cleared = false;

const clearCookieValidation = () => {
  document.querySelector('#cookie-test-iframe')?.remove();
  cleared = true;
}

const checkCookiesEnable = (ev: any, onEnabled: any, onDisabled?: any) => {
  if (ev.data === 'MM:3PCunsupported') {
    clearCookieValidation();
    if (onDisabled) {
      onDisabled();
    }
  } else if (ev.data === 'MM:3PCsupported') {
    clearCookieValidation();
    onEnabled();
  }
}

const cookieTest = () => {
  const frame = document.createElement('iframe');
  frame.id = 'cookie-test-iframe';
  frame.src = 'https://mindmup.github.io/3rdpartycookiecheck/start.html';
  frame.style.display = 'none';
  document.body.appendChild(frame);
}

export const validateThirdPartyCookies = (onEnabled: any, onDisabled?: any) => {
  cleared = false;

  const listener = (ev: any) => checkCookiesEnable(ev, onEnabled, onDisabled);
  window.addEventListener('message', listener);

  const timer = setInterval(() => {
    if (cleared) {
      window.removeEventListener('message', listener);
      clearInterval(timer);
    }
  }, 50);

  cookieTest();
}
