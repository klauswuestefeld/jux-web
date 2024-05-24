import { getTranslation } from './jux/language';
import { JuxEvent } from './jux/jux-event';
import { extractTokenFromWindowLocation } from './login/utils/token';

export const setBackendUrl = (backendUrl: string) => localStorage.setItem('backend-url', backendUrl);
//@ts-ignore
export const getBackendUrl = (): string => process.env.BACKEND_URL || localStorage.getItem('backend-url');
//@ts-ignore
const getSecondaryBackendUrl = (): string => process.env.STAGING_BACKEND_URL || getBackendUrl();
const getApiUrl = (): string => getBackendUrl() + 'api/';

const getMagicAuthUrl = (): string => {
  // @ts-ignore
  const endpoint = window?.store?.magicLinkAuthEndpoint || 'auth-magic';
  return getBackendUrl() + endpoint + '?token=';
}

const getMagicAuthReqUrl = (): string => {
  // @ts-ignore
  const endpoint = window?.store?.magicLinkRequestEndpoint || 'magic-link-request';
  return getBackendUrl() + endpoint + '?email=';
}

// TODO: use jux-events to call commands and queries inside jux-web library
export const handleJuxEvent = (ev: Event) => {
  const { requestType, endpoint, onResult, params, onError, onRedirect } = ev as JuxEvent;

  const onJsonResponse = (res: any) => onResult ? onResult(res) : null;
  const onHelpMessage = (err: any) => onError ? onError(err) : null;

  post(endpoint, params, onJsonResponse, onHelpMessage, onRedirect, requestType);
}

const applySpinnerStyle = (spinner: HTMLElement) => {
  spinner.style.position = 'fixed';
  spinner.style.top = '50%';
  spinner.style.zIndex = '2147483647';
  spinner.style.border = '8px solid #bababa';
  spinner.style.borderTopColor = '#171f1c';
  spinner.style.height = '80px';
  spinner.style.width = '80px';
}

const renderOverlay = (): void => {
  const overlay = document.createElement('reconnect-overlay');
  const spinner = document.createElement('loading-spinner');
  spinner.className = 'reconnect-spinner';
  applySpinnerStyle(spinner);
  document.body.append(overlay, spinner);
}

const removeOverlay = (): void => {
  document.querySelector('reconnect-overlay')?.remove();
  document.querySelector('.reconnect-spinner')?.remove();
}

const defaultHandleUnauthorized = () => {
  localStorage.removeItem('token');
  alert(getTranslation('session-expired-msg'));
  location.reload();
  // googleAuthSignOut(); TODO
}

let requestRunning = false;
const maxRetries = 20;
let timeout = 15000;

// @ts-ignore
window.setRequestTimeout = (newTimeout: number) => timeout = newTimeout;

export const backendRequest = async (
  url: string,
  options: any,
  onSuccess: any,
  onError: any,
  onRedirect?: any,
  requestType: string = 'query',
  handleUnauthorized: () => void = defaultHandleUnauthorized,
  retrial = false,
  retrialNum = 0,
) => {
  if (requestRunning && !retrial) { // only allow one request at a time
    setTimeout(() => backendRequest(url, options, onSuccess, onError, onRedirect, requestType, handleUnauthorized, false), 300);

    return;
  };

  // @ts-ignore
  const backendToken = window.store.backendToken;
  if (backendToken) {
    if (!options.headers) options.headers = {};
    options.headers.auth = backendToken;
  }

  let response;
  requestRunning = true;

  const controller = new AbortController();
  let timeoutId;
  if (requestType === 'query') {
    timeoutId = setTimeout(() => controller.abort(), timeout); // abort connections that take longer than the value set on the timeout const
  }

  const requestInit = { ...options, signal: controller.signal };

  if (onRedirect) requestInit.redirect = 'manual'; // Treat redirects manually instead of following them automatically.

  try {
    response = await fetch(url, requestInit);
  } catch (err) {
    // network errors
    if (requestType === 'command') {
      // Do not retry applying command if it fails for the first time.
      onError('There was an error performing your request. Please try again later.');
      requestRunning = false;

      return;
    }
    if (retrialNum > maxRetries) {
      removeOverlay();
      requestRunning = false;

      return;
    }

    const retryRequest = () => {
      retrialNum++;
      if (!document.querySelector('reconnect-overlay')) {
        renderOverlay();
      }
      if (url.includes(getBackendUrl())) {
        url = url.replace(getBackendUrl(), getSecondaryBackendUrl());
      } else if (url.includes(getSecondaryBackendUrl())) {
        url = url.replace(getSecondaryBackendUrl(), getBackendUrl());
      }
      setTimeout(() => backendRequest(url, options, onSuccess, onError, onRedirect, requestType, handleUnauthorized, true, retrialNum), 2000);
    }
    retryRequest();

    return;
  } finally {
    clearTimeout(timeoutId);
  }

  removeOverlay();

  if (onRedirect) onRedirect(response);
  if (response.type === 'opaqueredirect') {
    console.info('opaqueredirect'); // Stop processing request if its an opaqueredirect

    return; 
  } 


  if (response.status === 401) {
    handleUnauthorized();

    return;
  }

  try {
    const jsonResponse = await response.json();
    if (response.ok) {
      if (onSuccess) {
        onSuccess(jsonResponse);
      } else {
        return jsonResponse;
      }
    } else {
      // backend exceptions
      onError(jsonResponse.error);
    }
  } catch (err) {
    // json conversion error / json response dealing errors / onSuccess errors
    console.error(err)
  } finally {
    requestRunning = false;
  }
}

const post = (endpoint: string, body: any, onSuccess: any, onError: any, onRedirect?: any, requestType: string = "query") => {
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }

  if (body) {
    // @ts-ignore
    options.body = JSON.stringify(body);
  }

  return backendRequest(getApiUrl() + endpoint, options, onSuccess, onError, onRedirect, requestType);
}

const get = (endpoint: string, onSuccess: any, onError: any, onRedirect?: any) => {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }

  return backendRequest(getApiUrl() + endpoint, options, onSuccess, onError, onRedirect);
}

export const backendPost = (endpoint: string, postContent: any, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any): void => {
  post(endpoint, postContent, onJsonResponse, onHelpMessage);
}

export const backendGet = (endpoint: string, params: any, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any): void => {
  if (params) {
    endpoint += '?';
    Object.keys(params).forEach((k, i) => {
      if (i > 0) endpoint += '&';
      endpoint += `${k}=${params[k]}`;
    });
  }
  get(endpoint, onJsonResponse, onHelpMessage);
}

export const requestMagicLink = (data: any, onJsonResponse: (response: any) => any, onUnauthorized: () => void): void => {
  const { email, token } = data;
  const url = getMagicAuthReqUrl() + encodeURIComponent(email) + '&destination=' + extractTokenFromWindowLocation('destination') + '&token=' + token;
  const options = {};

  backendRequest(
    url,
    options,
    onJsonResponse,
    console.error,
    null,
    'query',
    onUnauthorized,
  );
}

export const openMagicLink = (magicToken: string, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any): void => {
  backendRequest(getMagicAuthUrl() + magicToken, {}, onJsonResponse, onHelpMessage);
}

export const googleLogin = (token: string, onLogin: (response: any) => any, onLoginError: (message: string) => any) => {
  const url = getBackendUrl() + 'auth-google?google-id-token=' + token;
  backendRequest(url, {}, onLogin, onLoginError);
}

export const microsoftLogin = (token: string, onLogin: (response: any) => any, onLoginError: (message: string) => any) => {
  const url = getBackendUrl() + 'auth-microsoft?access-token=' + token;
  backendRequest(url, {}, onLogin, onLoginError);
}

export const getMXData = async (domainName: string): Promise<any> => {
  try {
    const records = await fetch
      (
        `https://dns.google.com/resolve?name=${domainName}&type=MX`,
        {
          method: 'GET',
          mode: 'cors'
        }
      );
    if (!records.ok) {
      console.log('response was not ok');
      return null;
    }
    const recordsJson = await records.json();

    const answer = recordsJson.Answer;

    if (!answer) {
      return null;
    }

    return Array.from(answer).map((a: any) => a.data);
  } catch (error) {
    console.error('Fetch failed: ', error);
    return null;
  }
};
