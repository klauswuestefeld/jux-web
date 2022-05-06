import { disableSignInLayout, onUserChanged } from '../session';  

declare let gapi: any;
let authStatus: string;
let authError: any;
let logError: any;
let warning: any;

const highLevelUser = (gUser: any) => {
  const profile = gUser.getBasicProfile();
  return {
    name: profile.getName(),
    email: profile.getEmail(),
    picture: profile.getImageUrl(),
    googletoken: gUser.getAuthResponse().id_token
  };
}

const onGoogleUserChanged = (gUser: any, handleAppLogIn: () => void) => {
  onUserChanged(gUser.isSignedIn()
    ? highLevelUser(gUser)
    : null, handleAppLogIn);
}

const getAuth = () => {
  if (typeof gapi === 'undefined') {
    logError('gapi is undefined');

    return null;
  }

  return gapi.auth2 && gapi.auth2.getAuthInstance();
}

export const cookieError = () => {
  disableSignInLayout();
  warning('cookie-error');

  return;
}

const onAuthError = (error: any) => {
  authError = error;
  logError(error, authError);
}

const authAlert = (error: any) => {
  alert('Google authentication is not working at this moment.\n\nPlease try again later or use a magic sign-in link.\n\nError: ' + JSON.stringify(error));
  location.reload();
}

const onSignInError = (error: any) => {
  disableSignInLayout();
  logError(error);

  if (error && error.error === 'popup_closed_by_user') {
    onUserChanged(null, () => {});

    return;
  }

  authAlert(error);
}

const googleSignIn = () => getAuth().signIn().catch(onSignInError);

export const authSignIn = (handleAppLogIn: () => void) => {
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
        initGapi(() => googleSignIn(), handleAppLogIn);
      } catch (error) {
        onSignInError(error);
      }
    };
  }
}

export const googleAuthSignOut = async () => {
  const auth = getAuth();
  if (auth) {
    console.info('Google Auth: Signing out');
    await auth.signOut();
    await auth.disconnect();
  }
}

const initGapiClient = (callbackFn: any, handleAppLogIn: () => void) => {
  // @ts-ignore
  const clientId = process.env.GOOGLE_CLIENT_ID;

  gapi.auth2.init({ client_id: clientId, prompt: 'select_account' }).then(() => {
    authStatus = 'LOADED';
    const currentUser = getAuth().currentUser;
    currentUser.listen(onGoogleUserChanged);
    callbackFn ? callbackFn(clientId) : onGoogleUserChanged(currentUser.get(), handleAppLogIn);
  }, onAuthError);
}

export const initGapi = (callbackFn: any = null, handleAppLogIn: () => void) => {
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
    callback: () => initGapiClient(callbackFn, handleAppLogIn),
    onerror: onAuthError,
    ontimeout: onAuthError,
    timeout: 5000
  });
};
