import { getTranslation } from './jux/language';
import { extractTokenFromWindowLocation } from './login/utils/token';

const kebabCaseProvider = (): string => {
  const provider = localStorage.getItem('override-provider') || localStorage.getItem('provider');

  return provider?.replace(/\./g, '-') || '';
};
//@ts-ignore
const getDynamicBackendUrl = (): string | boolean => process.env.DYNAMIC_BACKEND_URL ? process.env.DYNAMIC_BACKEND_URL.replace('%provider', kebabCaseProvider()) : false; 
//@ts-ignore
const getBackendUrl = (): string => getDynamicBackendUrl() || process.env.BACKEND_URL;

//@ts-ignore
const getSecondaryBackendUrl = (): string => process.env.STAGING_BACKEND_URL || getBackendUrl();
let getBackendUrlToTry = (): string => getBackendUrl();

const getApiUrl = (): string => getBackendUrl() + 'api/';
export const getGoogleAuthUrl = (): string => getBackendUrl() + 'auth-google?google-id-token=';
export const getMicrosoftAuthUrl = (): string => getBackendUrl() + 'auth-microsoft?access-token=';
const getMagicAuthUrl = (): string => getBackendUrl() + 'auth-magic?token=';
const getMagicAuthReqUrl = (): string => getBackendUrl() + 'magic-link-request?email=';
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

export const backendRequest = (
  requestType: string,
  url: string,
  postContent: any,
  onJsonResponse: (response: any) => any,
  onHelpMessage: (message: string) => any
): void => {
  if (url.includes(getBackendUrl())) {
    url = url.replace(getBackendUrl(), getBackendUrlToTry());
  } else if (url.includes(getSecondaryBackendUrl())) {
    url = url.replace(getSecondaryBackendUrl(), getBackendUrlToTry());
  }

  clearInterval(timeout);
  const req = new XMLHttpRequest();
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
      localStorage.removeItem('token');
      alert(getTranslation('session-expired-msg'));
      location.reload();
      // googleAuthSignOut(); TODO
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

      url = url.replace(getBackendUrlToTry(), backupBackendUrl);

      getBackendUrlToTry = () => backupBackendUrl;

      timeout = setTimeout(() => {
        backendRequest(
          requestType,
          url,
          postContent,
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
  req.send(postContent);
}

export const backendPost = (endpoint: string, postContent: any, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any): void => {
  backendRequest('POST', getApiUrl() + endpoint, postContent, onJsonResponse, onHelpMessage);
}

export const backendGet = (endpoint: string, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any): void => {
  let api = getApiUrl() + endpoint;
  if (endpoint.includes(getGoogleAuthUrl()) || endpoint.includes(getMicrosoftAuthUrl())) {
    api = endpoint;
  }
  backendRequest('GET', api, undefined, onJsonResponse, onHelpMessage);
}

export const backendGetPromise = (endpoint: string) => new Promise((resolve, reject) =>
  backendGet(endpoint, resolve, reject));

export const requestMagicLink = (data: any, onJsonResponse: (response: any) => any): void => {
  backendRequest(
    'GET',
    getMagicAuthReqUrl() + encodeURIComponent(data.email) + '&destination=' + extractTokenFromWindowLocation('destination') + '&token=' + data.token,
    undefined,
    onJsonResponse,
    () => { }
  );
}

export const openMagicLink = (magicToken: string, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any): void => {
  backendRequest('GET', getMagicAuthUrl() + magicToken, undefined, onJsonResponse, onHelpMessage);
}

export const getMXData = async (domainName: string): Promise<any> => {
  const records = await fetch
    (
      `https://dns.google.com/resolve?name=${domainName}&type=MX`,
      {
        method: 'GET',
        mode: 'cors'
      }
    );
  const recordsJson = await records.json();
  const answer = recordsJson.Answer;

  if (!answer) {
    return null;
  }

  const data = Array.from(answer).map((a: any) => a.data);

  return data;
};
