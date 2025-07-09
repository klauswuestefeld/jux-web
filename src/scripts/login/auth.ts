import { googleLogin } from '../api-client';
import { disableSignInLayout } from './utils/layout-changes';
import { onTokenAcquired, setBackendToken } from './session';
import { CurrentUser } from '../jux/jux-web-global';

// TODO: find a better way to import external scripts
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://apis.google.com/js/api.js';
document.head.appendChild(script);

declare let gapi: any;
let authStatus: string;
let authError: any;

const highLevelUser = (gUser: any) => {
  const profile = gUser.getBasicProfile();
  return {
    name: profile.getName(),
    email: profile.getEmail(),
    picture: profile.getImageUrl(),
    googletoken: gUser.getAuthResponse().id_token
  };
}

const onUserChanged = (googleUser: any, onUserLogin: any) => {
  document.documentElement.classList.remove('progress');
  document.body.classList.remove('disabled');

  if (googleUser) {
    // mixpanelIdentify(googleUser); TODO
    const onSuccess = (res: CurrentUser) => {
      const { token } = res;
      window.juxWebGlobal?.setCurrentUser(res);
      onTokenAcquired(token, onUserLogin);
    }
    const onError = (err: any) => {
      console.error(err);
      // logError(error); TODO
      // checkMixpanel(() => mixpanel.track('Login Error', { 'Login Type': 'Google', 'Error': error })); TODO
    }
    googleLogin(googleUser.googletoken, onSuccess, onError);

    // checkMixpanel(() => mixpanel.track('Login', { 'Login Type': 'Google' })); TODO
  } else {
    setBackendToken('');
    // checkMixpanel(() => mixpanel.reset()); TODO
    // displayPage(Page.LOGIN); TODO
  }
}

const onGoogleUserChanged = (gUser: any, onUserLogin: any) => {
  onUserChanged(gUser.isSignedIn() ? highLevelUser(gUser) : null, onUserLogin);
}

const initGapiClient = (callbackFn: any, onUserLogin: any) => {
  // @ts-ignore
  const clientId = process.env.GOOGLE_CLIENT_ID;

  gapi.auth2.init({ client_id: clientId, prompt: 'select_account' }).then(() => {
    authStatus = 'LOADED';
    const currentUser = getAuth().currentUser;
    currentUser.listen(onGoogleUserChanged);
    callbackFn ? callbackFn(clientId) : onGoogleUserChanged(currentUser.get(), onUserLogin);
  }, onAuthError);
}

const onAuthError = (error: any) => {
  authError = error;
  console.error(error);
  // logError(error, authError); // TODO
}

export const initGapi = (callbackFn: any = null, onUserLogin: any) => {
  if (!window.location.protocol.startsWith('http')) {
    onAuthError('To use Google Auth you must access this page using http(s), not ' + window.location.protocol);

    return;
  }

  if (typeof gapi === 'undefined') {
    onAuthError('Unable to load the Google API');

    return;
  }

  authStatus = 'LOADING';
  gapi.load('auth2', {
    callback: () => initGapiClient(callbackFn, onUserLogin),
    onerror: onAuthError,
    ontimeout: onAuthError,
    timeout: 5000
  });
};

const authAlert = (error: any) => {
  alert('Google authentication is not working at this moment.\n\nPlease try again later or use a magic sign-in link.\n\nError: ' + JSON.stringify(error));
  location.reload();
}

const onSignInError = (error: any) => {
  disableSignInLayout();
  console.error(error);
  // logError(error); TODO

  if (error && error.error === 'popup_closed_by_user') {
    onUserChanged(null, () => { });

    return;
  }

  authAlert(error);
}

const getAuth = () => {
  if (typeof gapi === 'undefined') {
    console.error('gapi is undefined');
    // logError('gapi is undefined'); TODO

    return null;
  }

  return gapi.auth2 && gapi.auth2.getAuthInstance();
}

const googleSignIn = () => getAuth().signIn().catch(onSignInError);

export const authSignIn = (onUserLogin: any) => {
  if (authError) {
    authAlert(authError);

    return;
  }

  if (authStatus === 'LOADING') {
    setTimeout(authSignIn, 400);
  } else {
    try {
      googleSignIn();
    } catch (err) {
      try {
        initGapi(() => googleSignIn(), onUserLogin);
      } catch (error) {
        onSignInError(error);
      }
    };
  }
}
