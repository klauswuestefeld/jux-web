import { backendGet, backendGetPromise, microsoftAuthUrl, openMagicLink, requestMagicLink } from '../api-client';
import * as msal from '@azure/msal-browser';
import { validateThirdPartyCookies } from './utils/cookies';
import { authSignIn } from './auth';
import { enableSignInLayout, disableSignInLayout } from './utils/layout-changes';
import { magicLinkRequestedPage } from './magic-link-requested-page';
import { getTranslation } from '../jux/language';
import { extractTokenFromWindowLocation } from './utils/token';
import { loginPage } from './login-page';

export const setBackendToken = (token: string): void => {
  // @ts-ignore
  window.store.backendToken = token;
  if (token) {
    localStorage.setItem('token', token);
  }
}

const getBackendToken = (): string => {
  const token = localStorage.getItem('token') ?? '';
  // @ts-ignore
  window.store.backendToken = token;

  return token;
}

export const onTokenAcquired = (token: string, onUserLogin: any) => {
  setBackendToken(token);
  // setSuperToken();
  onUserLogin();
}

export const clearSession = () => {
  // onUserChanged(null);
  localStorage.clear();
  // @ts-ignore
  window.store = {};
}

const onAuthenticationFailure = (msg: string) => {
  localStorage.removeItem('token');
  // displayPage(Page.LOGIN);
  alert(getTranslation(msg));
}

const onAuthentication = (onUserLogin: any, user: any, type: string) => {
  if ((user.token && getBackendToken()) && getBackendToken() !== user.token) {
    clearSession();
  }

  // @ts-ignore
  window.store.currentUser = user;

  if (type === 'Token Authentication') {
    user.token = localStorage.getItem('token');
  }

  onTokenAcquired(user.token, onUserLogin);
  // mixpanelIdentify(user);
  // checkMixpanel(() => mixpanel.track('Login', { 'Login Type': type }));
}

const displayPage = (clientApp: HTMLElement, page: HTMLElement) => {
  Array.from(clientApp.children).forEach(el => el.remove());
  clientApp.appendChild(page);
}

export const initSession = (clientApp: HTMLElement, supportedLoginTypes: string[], onUserLogin: any, backgroundImage: string) => {
  // if (startNewDemo()) {
  //   initDemo(setBackendToken, onAuthentication);

  //   return;
  // }

  const magicToken = extractTokenFromWindowLocation('magic-link');
  if (magicToken) {
    openMagicLink(
      magicToken,
      (res: any) => onAuthentication(onUserLogin, res, 'Magic Link'),
      () => onAuthenticationFailure('unable-magic-login')
    );

    return;
  }

  if (getBackendToken()) {
    backendGet('profile',
      (res: any) => onAuthentication(onUserLogin, res, 'Token Authentication'),
      (_err: any) => onAuthenticationFailure('login-failed')
    );

    return;
  };

  displayPage(clientApp, loginPage(clientApp, backgroundImage, onUserLogin, supportedLoginTypes));

  // const linkedinToken = extractTokenFromWindowLocation('code', '\&state=9893849343');
  // if (linkedinToken) {
  //   openLinkedinSession(
  //     linkedinToken,
  //     (res) => onAuthentication(res, 'Linkedin Authentication'),
  //     () => onAuthenticationFailure('unable-linkedin-login')
  //   );

  //   return;
  // }

  // validateThirdPartyCookies(initGapi, () => displayPage(Page.LOGIN));
  // checkMixpanel(() => mixpanel.track('View Login Page'));
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

export const handleMagicLinkRequest = (token: string | null, onReturn: any, backgroundImage: string, currentPage: HTMLElement, clientBody: HTMLElement, email: string = '') => {
  if (!email) {
    const mailMagic = document.querySelector('#mail-magic') as HTMLInputElement;
    email = mailMagic.value;
  }

  const payload = { email, token };

  const provider = email.split('@')[1];
  localStorage.setItem('provider', provider);

  requestMagicLink(payload, (_res: any) => {
    currentPage.remove();
    clientBody.appendChild(magicLinkRequestedPage(backgroundImage, onReturn));

    const magicLinkEmail = document.querySelector('#magic-link-email') as HTMLElement;
    magicLinkEmail.textContent = email;
  });
}
