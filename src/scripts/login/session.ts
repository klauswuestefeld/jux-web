import { authPasswordLogin, backendGet, getSSOAuthorizationEndpoint, microsoftLogin, openMagicLink, requestMagicLink, setBackendUrl, validateSSOToken } from '../api-client';
import * as msal from '@azure/msal-browser';
import { validateThirdPartyCookies } from './utils/cookies';
import { authSignIn } from './auth';
import { enableSignInLayout, disableSignInLayout } from './utils/layout-changes';
import { magicLinkRequestedPage } from './magic-link-requested-page';
import { unauthorizedMagicLinkRequestPage } from './unauthorized-magic-link-request-page';
import { getTranslation } from '../jux/language';
import { CurrentUser, JuxWebGlobal } from '../jux/jux-web-global';
import { extractTokenFromWindowLocation } from './utils/token';
import { loginPage } from './login-page';
import { getLocalStorageItem, removeLocalStorageItem, setUrlPrefix } from '../local-storage/utils';
import { onTokenAcquired, clearSession } from './session-actions';

const getBackendToken = (): string => {
  const token = getLocalStorageItem('token') ?? '';
  window.juxWebGlobal?.setBackendToken(token);

  return token;
}

const onAuthenticationFailure = (msg: string) => {
  removeLocalStorageItem('token');
  // displayPage(Page.LOGIN);
  alert(getTranslation(msg));
}

const onAuthentication = (onUserLogin: any, user: any, type: string) => {
  if ((user.token && getBackendToken()) && getBackendToken() !== user.token) {
    clearSession();
  }

  window.juxWebGlobal?.setCurrentUser(user);

  if (type === 'Token Authentication') {
    user.token = getLocalStorageItem('token');
  }

  onTokenAcquired(user.token, onUserLogin);
  // mixpanelIdentify(user);
  // checkMixpanel(() => mixpanel.track('Login', { 'Login Type': type }));
}

const displayPage = (clientApp: HTMLElement, page: HTMLElement) => {
  Array.from(clientApp.children).forEach(el => el.remove());
  clientApp.appendChild(page);
}

const getBaseElementHref = (): string | null => {
  const baseElement = document.getElementsByTagName('base')[0];
  if (!baseElement) return null;

  return baseElement.href || null;
}

const produceSSORedirectURI = (): string => {
  const baseElementHref = getBaseElementHref();
  if (baseElementHref) return baseElementHref;

  const { protocol, host } = window.location;
  return protocol + '//' + host + '/';
}

const getSSORedirectURI = (): string => produceSSORedirectURI() + 'callback';

const handleSSOLogin = () => {
  const onSuccess = (authEndpoint: any) => {
    const authUrl = authEndpoint + `&redirect_uri=${getSSORedirectURI()}`;
    window.location.replace(authUrl);
  };

  const onError = () => onAuthenticationFailure('login-failed');

  getSSOAuthorizationEndpoint(onSuccess, onError);
}

interface InitSessionParams {
  clientApp: HTMLElement;
  supportedLoginTypes: string[];
  onUserLogin: any;
  onLoginError: any;
  backgroundImage: string;
  fetchUserBackendUrl: any;
  magicLinkRequestEndpoint?: string;
  magicLinkAuthEndpoint?: string;
  urlPrefix: string;
}

export const initSession = (
  {
    clientApp,
    supportedLoginTypes,
    onUserLogin,
    onLoginError,
    backgroundImage,
    fetchUserBackendUrl,
    magicLinkRequestEndpoint,
    magicLinkAuthEndpoint,
    urlPrefix
  }: InitSessionParams) => {
  // if (startNewDemo()) {
  //   initDemo(setBackendToken, onAuthentication);

  //   return;
  // }

  if (!window.juxWebGlobal)
    window.juxWebGlobal = new JuxWebGlobal();

  window.juxWebGlobal.fetchUserBackendUrl = fetchUserBackendUrl;
  window.juxWebGlobal.magicLinkRequestEndpoint = magicLinkRequestEndpoint;
  window.juxWebGlobal.magicLinkAuthEndpoint = magicLinkAuthEndpoint;

  if (urlPrefix)
    setUrlPrefix(urlPrefix);

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
      window.juxWebGlobal.fetchUserBackendUrl({ host }, (backendUrl: string) => {
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
      getSSORedirectURI(),
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

  const supportedLoginTypesArray = Array.isArray(supportedLoginTypes)
  ? supportedLoginTypes
    : [supportedLoginTypes]
  
  displayPage(clientApp, loginPage(clientApp, backgroundImage, onUserLogin, onLoginError, supportedLoginTypesArray, handleSSOLogin, { onAuthPasswordLogin, onGoogleSignIn, onMicrosoftSignIn, handleMagicLinkRequest }));

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
    const onSuccess = (res: CurrentUser) => {
      const { token } = res;

      window.juxWebGlobal?.setCurrentUser(res);

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

export const onAuthPasswordLogin = (credentials: any, onUserLogin: any, onLoginError: any, onReturn: any, clientApp: HTMLElement, backgroundImg: string) => {
  const { email } = credentials;
  enableSignInLayout();

  const onSuccess = (res: CurrentUser) => {
    const { token } = res;

    window.juxWebGlobal?.setCurrentUser(res);

    onTokenAcquired(token, onUserLogin);
    disableSignInLayout();
  }

  const onError = (err: any) => {
    disableSignInLayout();
    onLoginError(err);
  }

  const onUnauthorized = () => {
    disableSignInLayout();

    const page = unauthorizedMagicLinkRequestPage(backgroundImg, onReturn, 'auth-password-fail-info');
    const magicLinkEmail = page.querySelector('#magic-link-email') as HTMLElement;
    magicLinkEmail.textContent = email;

    displayPage(clientApp, page);
  }

  authPasswordLogin(credentials, onSuccess, onError, onUnauthorized);
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

  if (window.juxWebGlobal?.fetchUserBackendUrl) {
    window.juxWebGlobal.fetchUserBackendUrl({ email }, (backendUrl: string) => {
      setBackendUrl(backendUrl);
      onRequestMagicLink();
    });

    return;
  }

  onRequestMagicLink();
}
