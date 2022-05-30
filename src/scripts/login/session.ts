import { backendGetPromise, microsoftAuthUrl, requestMagicLink } from '../api-client';
import * as msal from '@azure/msal-browser';
import { validateThirdPartyCookies } from './utils/cookies';
import { authSignIn } from './auth';
import { enableSignInLayout, disableSignInLayout } from './utils/layout-changes';
import { magicLinkRequestedPage } from './magic-link-requested-page';

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

export const onMicrosoftSignIn = async (onUserLogin: any) => {
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

export const onGoogleSignIn = (onUserLogin: any) => {
  validateThirdPartyCookies(() => {
    enableSignInLayout();
    authSignIn(onUserLogin);
  }, onCookieError);
}

export const handleMagicLinkRequest = (token: string | null, onReturn: any, email: string = '') => {
  if (!email) {
    const mailMagic = document.querySelector('#mail-magic') as HTMLInputElement;
    email = mailMagic.value;
  }

  const payload = { email, token };

  requestMagicLink(payload, (_res: any) => {
    document.body.appendChild(magicLinkRequestedPage('', onReturn));

    const magicLinkEmail = document.querySelector('#magic-link-email');
    if (!magicLinkEmail) {
      console.error('#magic-link-email não foi encontrado');
      // TODO: error reporting
      // logError('#magic-link-email não foi encontrado', 'generic-help-msg');

      return;
    }
    magicLinkEmail.textContent = email;
  });
}
