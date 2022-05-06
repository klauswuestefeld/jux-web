import { authSignIn, cookieError, googleAuthSignOut, initGapi } from './jux/auth';
import { backendGet, backendGetPromise, googleAuthUrl, microsoftAuthUrl, openLinkedinSession, openMagicLink, requestMagicLink } from './api-client';
import { getTranslation } from './i18n';
// import * as msal from '@azure/msal-browser';
import { validateThirdPartyCookies } from './utils/cookies';
import { displayPage, Page } from './utils/navigation';

let logError: any;
let reportError: any;

const extractTokenFromWindowLocation = (tokenParam: string, additionalParam = '') => {
  if (!tokenParam) {
    return;
  }

  let token = '';
  const tokenParameterName = `${tokenParam}=`;
  const tokenParameterIndex = window.location.search.indexOf(tokenParameterName);

  if (tokenParameterIndex !== -1) {
    const tokenParameterNameLength = tokenParameterName.length;
    const nextParameterIndex = window.location.search.indexOf('&', tokenParameterIndex);

    token = (nextParameterIndex === -1) ?
      window.location.search.substring(tokenParameterIndex + tokenParameterNameLength) :
      window.location.search.substring(tokenParameterIndex + tokenParameterNameLength, nextParameterIndex);

    let searchWithoutToken = window.location.search.replace(`${tokenParam}=` + token, '').replace(additionalParam, '').replace('\&cypress=true', '');
    if (searchWithoutToken === '?') {
      searchWithoutToken = '';
    }

    window.history.replaceState({}, document.title, window.location.pathname + searchWithoutToken);
  }

  return token;
}

const setBackendToken = (token: string): void => {
  // @ts-ignore
  window.store.backendToken = token;
  if (token) {
    localStorage.setItem('token', token);
  }
}

const setSuperToken = (): void => {
  const superToken = extractTokenFromWindowLocation('super-token');
  if (superToken) {
    localStorage.setItem('super-token', superToken);
  }
}

const getBackendToken = (): string => {
  const token = localStorage.getItem('token') ?? '';
  // @ts-ignore
  window.store.backendToken = token;

  return token;
}

const onTokenAcquired = (token: string, handleAppLogIn: () => void) => {
  setBackendToken(token);
  setSuperToken();
  handleAppLogIn();
}

const onAuthentication = (user: any, type: string, handleAppLogIn: () => void) => {
  if ((user.token && getBackendToken()) && getBackendToken() !== user.token) {
    clearSession();
  }
  // @ts-ignore
  window.store.currentUser = user;

  if (type === 'Percival Token Authentication') {
    user.token = localStorage.getItem('token');
  }

  onTokenAcquired(user.token, handleAppLogIn);
}

const onAuthenticationFailure = (msg: string) => {
  localStorage.removeItem('token');
  displayPage(Page.LOGIN);
  alert(getTranslation(msg));
}

export const onUserChanged = async (googleUser: any, handleAppLogIn: () => void) => {
  document.documentElement.classList.remove('progress');
  document.querySelector('percy-body')?.classList.remove('disabled');

  if (googleUser) {
    try {
      await backendGetPromise(googleAuthUrl + googleUser.googletoken)
        .then((res: any) => {
          const { token } = res as any;
          // @ts-ignore
          window.store.currentUser = res; 
          onTokenAcquired(token, handleAppLogIn);
        })
        .catch((error: any) => { throw Error(error) });
    } catch (error) {
      logError(error);

      return;
    }

  } else {
    setBackendToken('');
    displayPage(Page.LOGIN);
  }
}

export const initSession = (handleAppLogIn: () => void) => {
  const magicToken = extractTokenFromWindowLocation('magic-link');
  if (magicToken) {
    openMagicLink(
      magicToken,
      (res: any) => onAuthentication(res, 'Magic Link', handleAppLogIn),
      () => onAuthenticationFailure('unable-magic-login')
    );

    return;
  }

  if (getBackendToken()) {
    backendGet('profile',
      (res: any) => onAuthentication(res, 'Percival Token Authentication', handleAppLogIn),
      (_err: any) => onAuthenticationFailure('login-failed')
    );

    return;
  };

  const linkedinToken = extractTokenFromWindowLocation('code', '\&state=9893849343');
  if (linkedinToken) {
    openLinkedinSession(
      linkedinToken,
      (res: any) => onAuthentication(res, 'Linkedin Authentication', handleAppLogIn),
      () => onAuthenticationFailure('unable-linkedin-login')
    );

    return;
  }

  validateThirdPartyCookies(initGapi, () => displayPage(Page.LOGIN));
}

export const onLinkedinSignIn = () => {
  // @ts-ignore
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI!;
  // @ts-ignore
  const clientId = process.env.LINKEDIN_CLIENT_ID;

  let state = '9893849343';
  const destination = extractTokenFromWindowLocation('destination');
  if (destination) {
    state = 'buy-now';
  }

  const linkedinLink = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&state=${state}&scope=r_liteprofile%20r_emailaddress&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  window.location.replace(linkedinLink);
};

export const disableSignInLayout = () => {
  document.documentElement.classList.remove('progress');
  document.querySelector('percy-body')?.classList.remove('disabled');
}

const enableSignInLayout = () => {
  document.documentElement.classList.add('progress');
  document.querySelector('percy-body')?.classList.add('disabled');
}

export const onGoogleSignIn = (handleAppLogIn: () => void) => {
  validateThirdPartyCookies(() => {
    enableSignInLayout();
    authSignIn(handleAppLogIn);
  }, cookieError);
}

export const onMicrosoftSignIn = async (handleAppLogIn: () => void) => {
  // @ts-ignore
  const msalConfig = { auth: { clientId: process.env.MICROSOFT_CLIENT_ID } };
  // @ts-ignore
  const msalInstance = new msal.PublicClientApplication(msalConfig);
  const loginRequest = { scopes: ['user.read'] };
  enableSignInLayout();
  try {
    const loginResponse = await msalInstance.loginPopup(loginRequest);
    const { accessToken } = loginResponse;
    await backendGetPromise(microsoftAuthUrl + accessToken)
      .then((res: any) => {
        const { token } = res as any;
        // @ts-ignore
        window.store.currentUser = res;
        onTokenAcquired(token, handleAppLogIn);
      })
      .catch(logError)
      .finally(() => disableSignInLayout());
  } catch (err) {
    reportError(err);
    disableSignInLayout();
  }
};

export const clearSession = () => {
  onUserChanged(null, () => {});
  localStorage.clear();
  // @ts-ignore
  window.store = {};
}

export const goBackToSuperAdmin = () => {
  const superToken = localStorage.getItem('super-token');
  clearSession();
  window.open(`/?magic-link=${superToken}`, '_self');
}

export const signOut = () => {
  clearSession();
  validateThirdPartyCookies(() => initGapi(async () => googleAuthSignOut(), () => {}));
}

export const handleSignOut = () => {
  const superToken = localStorage.getItem('super-token');

  if (superToken) {
    goBackToSuperAdmin();
  } else {
    signOut();
  }
}

export const handleMagicLinkRequest = (token: string | null, email: string = '') => {
  if (!email) {
    const mailMagic = document.querySelector('#mail-magic') as HTMLInputElement;
    email = mailMagic.value;
  }

  const sandbox = window.location.hostname === 'localhost';
  const payload = { email, token, sandbox };

  requestMagicLink(payload, (_res: any) => {
    displayPage(Page.MAGIC_LOGIN);

    const magicLinkEmail = document.querySelector('#magic-link-email');
    if (!magicLinkEmail) {
      logError('#magic-link-email não foi encontrado', 'generic-help-msg');

      return;
    }
    magicLinkEmail.textContent = email;
  });
}
