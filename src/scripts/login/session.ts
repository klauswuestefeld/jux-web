import { backendGet, getBackendUrl, getSSOAuthorizationEndpoint, microsoftLogin, openMagicLink, requestMagicLink, setBackendUrl, validateSSOToken } from '../api-client';
import * as msal from '@azure/msal-browser';
import { validateThirdPartyCookies } from './utils/cookies';
import { authSignIn } from './auth';
import { enableSignInLayout, disableSignInLayout } from './utils/layout-changes';
import { magicLinkRequestedPage } from './magic-link-requested-page';
import { unauthorizedMagicLinkRequestPage } from './unauthorized-magic-link-request-page';
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

const clearSession = () => {
  // onUserChanged(null);
  // TODO: find a better way to preserve backend-url
  const backendUrl = getBackendUrl(); // Preserve backend, since the authentication was succcessfull
  localStorage.clear();
  setBackendUrl(backendUrl);
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

const getSSOCallbackURI = (): string => {
  const { protocol, host } = window.location;
  return protocol + '//' + host + '/callback';
}

const handleSSOLogin = () => {
  const onSuccess = (authEndpoint: any) => {
    const authUrl = authEndpoint + `&redirect_uri=${getSSOCallbackURI()}`;
    window.location.replace(authUrl);
  };

  const onError = () => onAuthenticationFailure('login-failed');

  getSSOAuthorizationEndpoint(onSuccess, onError);
}

export const initSession = (clientApp: HTMLElement, supportedLoginTypes: string[], onUserLogin: any, backgroundImage: string, fetchUserBackendUrl: any, magicLinkRequestEndpoint: string | null, magicLinkAuthEndpoint: string | null) => {
  // if (startNewDemo()) {
  //   initDemo(setBackendToken, onAuthentication);

  //   return;
  // }

  // @ts-ignore
  if (!window.store) {
    // @ts-ignore
    window.store = {};
  }
  // @ts-ignore
  window.store.fetchUserBackendUrl = fetchUserBackendUrl;
  // @ts-ignore
  window.store.magicLinkRequestEndpoint = magicLinkRequestEndpoint;
  // @ts-ignore
  window.store.magicLinkAuthEndpoint = magicLinkAuthEndpoint;

  const signInToken = extractTokenFromWindowLocation('sign-in') || extractTokenFromWindowLocation('magic-link');
  if (signInToken) {
    const onOpenMagicLink = () => {
      openMagicLink(
        signInToken,
        (res: any) => onAuthentication(onUserLogin, res, 'Magic Link'),
        () => onAuthenticationFailure('unable-magic-login')
      );
    }
    const host = extractTokenFromWindowLocation('host');
    if (host) {
      // @ts-ignore
      window.store.fetchUserBackendUrl({ host }, (backendUrl) => {
        setBackendUrl(backendUrl);
        onOpenMagicLink();
      });
      return;
    }

    onOpenMagicLink();

    return;
  }

  if (getBackendToken()) {
    backendGet('profile',
      null,
      (res: any) => onAuthentication(onUserLogin, res, 'Token Authentication'),
      (_err: any) => onAuthenticationFailure('login-failed')
    );

    return;
  };

  const ssoToken = extractTokenFromWindowLocation('code');
  if (ssoToken) {
    validateSSOToken(
      ssoToken,
      getSSOCallbackURI(),
      (res: any) => onAuthentication(onUserLogin, res, 'SSO Authentication'),
      (_res: any) => onAuthenticationFailure('login-failed'),
      async (res: any) => {
        const jsonResponse = await res.json();
        const unauthorizedEmail = jsonResponse.email;

        const onReturn = () => handleSSOLogin();
        const page = unauthorizedMagicLinkRequestPage(backgroundImage, onReturn);

        const magicLinkEmail = page.querySelector('#magic-link-email') as HTMLElement;
        magicLinkEmail.textContent = unauthorizedEmail;

        displayPage(clientApp, page);
      }
    );

    return;
  }

  if (supportedLoginTypes.includes('SSO')) {
    handleSSOLogin();

    return;
  }

  displayPage(clientApp, loginPage(clientApp, backgroundImage, onUserLogin, supportedLoginTypes));

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
    const onSuccess = (res: any) => {
      const { token } = res;
      // @ts-ignore
      window.store.currentUser = res;
      onTokenAcquired(token, onUserLogin);
      disableSignInLayout();
    }
    const onError = (err: any) => {
      console.error(err);
      reportError(err);
      disableSignInLayout();
    }
    microsoftLogin(accessToken, onSuccess, onError);
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

  const onRequestMagicLink = () => {
    const onResponse = (page: HTMLElement) => {
      currentPage.remove();
      clientBody.appendChild(page);

      const magicLinkEmail = page.querySelector('#magic-link-email') as HTMLElement;
      magicLinkEmail.textContent = email;
    }

    const onSuccess = () => onResponse(magicLinkRequestedPage(backgroundImage, onReturn));
    const onUnauthorized = () => onResponse(unauthorizedMagicLinkRequestPage(backgroundImage, onReturn));

    requestMagicLink(payload, onSuccess, onUnauthorized);
  }

  // @ts-ignore
  if (window.store.fetchUserBackendUrl) {
    // @ts-ignore
    window.store.fetchUserBackendUrl({ email }, (backendUrl) => {
      setBackendUrl(backendUrl);
      onRequestMagicLink();
    });

    return;
  }

  onRequestMagicLink();
}
