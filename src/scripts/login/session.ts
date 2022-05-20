import { backendGetPromise, microsoftAuthUrl, requestMagicLink } from '../api-client';
import * as msal from '@azure/msal-browser';
import { validateThirdPartyCookies } from './utils/cookies';
import { authSignIn } from './auth';

export const setBackendToken = (token: string): void => {
  // @ts-ignore
  window.store.backendToken = token;
  if (token) {
    localStorage.setItem('token', token);
  }
}

export const onTokenAcquired = (token: string, onUserLogin: any) => {
  setBackendToken(token);
  // setSuperToken();
  onUserLogin();
}

const enableSignInLayout = () => {
  document.body.style.cursor = 'progress';
  document.body.style.opacity = '0.5';
  document.body.style.pointerEvents = 'none';
}

export const disableSignInLayout = () => {
  document.body.style.cursor = 'default';
  document.body.style.opacity = '1';
  document.body.style.pointerEvents = 'auto';
}

export const onMicrosoftSignIn = async (onUserLogin: any) => {
  // @ts-ignore
  const msalConfig = { auth: { clientId: process.env.MICROSOFT_CLIENT_ID } } as msal.Configuration;
  const msalInstance = new msal.PublicClientApplication(msalConfig);
  const loginRequest = { scopes: ['user.read'] };
  enableSignInLayout();
  try {
    const loginResponse = await msalInstance.loginPopup(loginRequest);
    const { accessToken } = loginResponse;
    await backendGetPromise(microsoftAuthUrl + accessToken)
      .then((res: any) => {
        const { token } = res;
        // @ts-ignore
        window.store.currentUser = res;
        onTokenAcquired(token, onUserLogin);
      })
      .catch(console.error)
      .finally(() => disableSignInLayout());
  } catch (err) {
    reportError(err);
    disableSignInLayout();
  }
}

const onCookieError = () => {
  disableSignInLayout();
  // warning('cookie-error'); TODO

  return;
}

// TODO: import gapi library
export const onGoogleSignIn = (onUserLogin: any) => {
  validateThirdPartyCookies(() => {
    enableSignInLayout();
    authSignIn(onUserLogin);
  }, onCookieError);
}

export const handleMagicLinkRequest = (token: string | null, email: string = '') => {
  if (!email) {
    const mailMagic = document.querySelector('#mail-magic') as HTMLInputElement;
    email = mailMagic.value;
  }

  const sandbox = window.location.hostname === 'localhost';
  const payload = { email, token, sandbox };

  requestMagicLink(payload, (_res: any) => {
    // displayPage(Page.MAGIC_LOGIN);

    const magicLinkEmail = document.querySelector('#magic-link-email');
    if (!magicLinkEmail) {
      // logError('#magic-link-email não foi encontrado', 'generic-help-msg');

      return;
    }
    magicLinkEmail.textContent = email;
  });
}
