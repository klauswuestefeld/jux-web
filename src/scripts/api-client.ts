import { getTranslation } from './jux/language';
import { JuxEvent } from './jux/jux-event';
import { extractTokenFromWindowLocation } from './login/utils/token';

export const setBackendUrl = (backendUrl: string) => localStorage.setItem('backend-url', backendUrl);
//@ts-ignore
export const getBackendUrl = (): string => process.env.BACKEND_URL || localStorage.getItem('backend-url');
//@ts-ignore
const getSecondaryBackendUrl = (): string => process.env.STAGING_BACKEND_URL || getBackendUrl();
const getApiUrl = (): string => getBackendUrl() + 'api/';
let getBackendUrlToTry = (): string => getBackendUrl();

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
export const handleJuxEvents = (ev: Event) => {
  const { endpoint, onResult, params, onError } = ev as JuxEvent;

  const onJsonResponse = (res: any) => onResult ? onResult(res) : null;
  const onHelpMessage = (err: any) => onError ? onError(err) : null;

  backendPost(endpoint, params, onJsonResponse, onHelpMessage);
}

let timeout: any;
const maxRetries = 20;
let retries = 0;

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

const backendHelpMessage = (req: XMLHttpRequest): any => {
  return req.response && req.response.error || req.response || req;
}

const defaultHandleUnauthorized = () => {
  localStorage.removeItem('token');
  alert(getTranslation('session-expired-msg'));
  location.reload();
  // googleAuthSignOut(); TODO
}

export const backendRequest = (
  requestType: string,
  urlString: string,
  params: any,
  onJsonResponse: (response: any) => any,
  onHelpMessage: (message: string) => any,
  handleUnauthorized: () => void = defaultHandleUnauthorized,
): void => {
  if (urlString.includes(getBackendUrl())) {
    urlString = urlString.replace(getBackendUrl(), getBackendUrlToTry());
  } else if (urlString.includes(getSecondaryBackendUrl())) {
    urlString = urlString.replace(getSecondaryBackendUrl(), getBackendUrlToTry());
  }

  clearInterval(timeout);
  const req = new XMLHttpRequest();
  const url = new URL(urlString);

  if (requestType === 'GET' && params) {
    Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));
  }

  req.open(requestType, url, true);

  // @ts-ignore
  const backendToken = window.store.backendToken;

  if (backendToken) {
    req.setRequestHeader('auth', backendToken);
  }

  req.setRequestHeader('Content-Type', 'application/json');
  req.responseType = 'json';

  req.onerror = req.ontimeout = (): any => {
    if (req.status === 401) {
      handleUnauthorized();
    } else if (req.status === 0) {
      if (retries >= maxRetries) {
        removeOverlay();
        // displayPage(Page.DISCONNECTED); TODO

        return;
      }

      retries++;

      if (!document.querySelector('reconnect-overlay')) {
        renderOverlay();
      }

      const backupBackendUrl = getBackendUrlToTry() === getBackendUrl()
        ? getSecondaryBackendUrl()
        : getBackendUrl();

      urlString = urlString.replace(getBackendUrlToTry(), backupBackendUrl);

      getBackendUrlToTry = () => backupBackendUrl;

      timeout = setTimeout(() => {
        backendRequest(
          requestType,
          urlString,
          params,
          onJsonResponse,
          onHelpMessage,
        );
      }, 2000);
    } else {
      onHelpMessage(backendHelpMessage(req));
    }
  }

  req.onload = () => {
    retries = 0;
    removeOverlay();

    if (req.status === 200 || req.status === 202) {
      onJsonResponse(req.response);
    } else {
      if (req.onerror) {
        // @ts-ignore
        req.onerror();
      }
    }
  }

  req.timeout = 25000;
  req.send(params);
}

export const backendPost = (endpoint: string, postContent: any, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any): void => {
  const params = JSON.stringify(postContent);
  backendRequest('POST', getApiUrl() + endpoint, params, onJsonResponse, onHelpMessage);
}

export const backendGet = (endpoint: string, params: any, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any): void => {
  backendRequest('GET', getApiUrl() + endpoint, params, onJsonResponse, onHelpMessage);
}

export const requestMagicLink = (data: any, onJsonResponse: (response: any) => any, onUnauthorized: () => void): void => {
  const { email, token } = data;
  const url = getMagicAuthReqUrl() + encodeURIComponent(email) + '&destination=' + extractTokenFromWindowLocation('destination') + '&token=' + token;

  backendRequest(
    'GET',
    url,
    null,
    onJsonResponse,
    console.error,
    onUnauthorized,
  );
}

export const openMagicLink = (magicToken: string, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any): void => {
  backendRequest('GET', getMagicAuthUrl() + magicToken, null, onJsonResponse, onHelpMessage);
}

export const googleLogin = (token: string, onLogin: (response: any) => any, onLoginError: (message: string) => any) => {
  const url = getBackendUrl() + 'auth-google?google-id-token=' + token;
  backendRequest('GET', url, null, onLogin, onLoginError);
}

export const microsoftLogin = (token: string, onLogin: (response: any) => any, onLoginError: (message: string) => any) => {
  const url = getBackendUrl() + 'auth-microsoft?access-token=' + token;
  backendRequest('GET', url, null, onLogin, onLoginError);
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
