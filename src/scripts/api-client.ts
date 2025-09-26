import { getTranslation } from './jux/language';
import { JuxEvent } from './jux/jux-event';
import { extractTokenFromWindowLocation } from './login/utils/token';
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from './local-storage/utils';
import { captchaChallenge } from './captcha/turnstyle';

export const setBackendUrl = (backendUrl: string) => setLocalStorageItem('backend-url', backendUrl);
//@ts-ignore
export const getBackendUrl = (): string => process.env.BACKEND_URL || getLocalStorageItem('backend-url');
//@ts-ignore
const getSecondaryBackendUrl = (): string => process.env.STAGING_BACKEND_URL || getBackendUrl();
const getApiUrl = (): string => getBackendUrl() + 'api/';

const getMagicAuthUrl = (): string => {
  const endpoint = window.juxWebGlobal?.magicLinkAuthEndpoint || 'auth-magic';
  return getBackendUrl() + endpoint + '?token=';
}

const getMagicAuthReqUrl = (): string => {
  const endpoint = window.juxWebGlobal?.magicLinkRequestEndpoint || 'magic-link-request';
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
  removeLocalStorageItem('token');
  alert(getTranslation('session-expired-msg'));
  location.reload();
  // googleAuthSignOut(); TODO
}

let requestRunning = false;
const maxRetries = 20;
let timeout = 20000;
const slowRequestTimeout = 2000;

// @ts-ignore
window.setRequestTimeout = (newTimeout: number) => timeout = newTimeout;

export interface BackendRequestOptions extends RequestInit {
  file?: File;
  onProgress?: (percent: number) => void;
}

export type RequestType = 'query' | 'command' | 'upload';

export const upload = (
  endpoint: string,
  file: File,
  onResult?: (result: any) => any,
  onError?: (error: any) => void,
  extras?: {
    onProgress?: (percent: number) => void;
    onStart?: () => void;
  }) => {
  apiRequest(
    endpoint,
    {
      file,
      onProgress: (pct: number) => extras?.onProgress?.(pct)
    },
    (text: string) => onResult?.(text),
    (err: any) => onError?.(err),
    undefined,            // no redirect handler
    'upload',             // requestType
    undefined,
    undefined,
    undefined,
    extras
  );
}

const apiRequest = async (
  url: string,
  options: BackendRequestOptions = {},
  onSuccess?: (response: any) => void,
  onError?: (error: any) => void,
  onRedirect?: (response: Response) => void,
  requestType: string = 'query',
  handleUnauthorized: (res: Response) => void = defaultHandleUnauthorized,
  retrial: boolean = false,
  retrialNum: number = 0,
  extras?: any
) => {
  url = getApiUrl() + url;
  backendRequest(url, options, onSuccess, onError, onRedirect, requestType, handleUnauthorized, retrial, retrialNum, extras);
}

type UploadExtras = {
  onProgress?: (percent: number) => void;
  onStart?: (controls: { abortUpload: () => void }) => void;
};

const uploadRequest = (
  url: string,
  file: File,
  onSuccess?: (response: any) => void,
  onError?: (error: any) => void,
  extras?: UploadExtras
) => {
  requestRunning = true;

  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);

  const backendToken = window.juxWebGlobal?.getBackendToken();
  if (backendToken)
    xhr.setRequestHeader('auth', backendToken);

  xhr.upload.onprogress = (e: ProgressEvent) => {
    if (e.lengthComputable && extras?.onProgress) {
      extras.onProgress(Math.round((e.loaded / e.total) * 100));
    }
  };

  xhr.onload = () => {
    requestRunning = false;
    if (xhr.status >= 200 && xhr.status < 300) {
      onSuccess?.(xhr.responseText);
    } else {
      onError?.(xhr.responseText);
    }
  };

  xhr.onerror = () => {
    requestRunning = false;
    onError?.('Error sending file. Please try again.');
  };

  xhr.send(file);

  if (extras?.onStart) {
    extras.onStart({
      abortUpload: () => {
        console.log('Aborting upload');
        xhr.abort();
        requestRunning = false;
      }
    });
  }
}

const backendRequest = async (
  url: string,
  options: BackendRequestOptions = {},
  onSuccess?: (response: any) => void,
  onError?: (error: any) => void,
  onRedirect?: (response: Response) => void,
  requestType: string = 'query',
  handleUnauthorized: (res: Response) => void = defaultHandleUnauthorized,
  retrial: boolean = false,
  retrialNum: number = 0,
  extras?: any
) => {
  if (requestRunning && !retrial) { // only allow one request at a time
    setTimeout(() => backendRequest(
      url, options, onSuccess, onError, onRedirect,
      requestType, handleUnauthorized, false, retrialNum
    ), 300);

    return;
  };

  const headers = new Headers(options.headers);
  const backendToken = window.juxWebGlobal?.getBackendToken();
  if (backendToken)
    headers.set('auth', backendToken);

  let response;
  requestRunning = true;

  const controller = new AbortController();
  let timeoutId;
  if (requestType === 'query') {
    timeoutId = setTimeout(() => controller.abort(), timeout); // abort connections that take longer than the value set on the timeout const
  }

  let isSlowRequest = false
  const slowRequestTimeoutId = setTimeout(() => {
    isSlowRequest = true
    const requestUrl = new URL(url)
    const event = new CustomEvent('slow-request', { detail: requestUrl.pathname, bubbles: true });
    window.dispatchEvent(event);
  }, slowRequestTimeout);

  const requestInit = {
    ...options,
    headers,
    signal: controller.signal
  };

  if (onRedirect) requestInit.redirect = 'manual'; // Treat redirects manually instead of following them automatically.

  try {
  if (requestType === 'upload') {
    uploadRequest(
      url,
      options.file!,
      onSuccess,
      onError,
      extras
    );
    return;
  }

    response = await fetch(url, requestInit);
  } catch (err) {
    if (requestType === 'command') {
      onError?.('There was an error performing your request. Please try again later.');
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
      setTimeout(() => backendRequest(
        url, options, onSuccess, onError, onRedirect,
        requestType, handleUnauthorized, true, retrialNum
      ), 2000);
    }
    retryRequest();

    return;
  } finally {
    clearTimeout(timeoutId);
    clearTimeout(slowRequestTimeoutId);

    if (isSlowRequest) {
      const requestUrl = new URL(url)
      const event = new CustomEvent('slow-request-completed', { detail: requestUrl.pathname, bubbles: true });
      window.dispatchEvent(event);
    }
  }

  removeOverlay();

  if (onRedirect) onRedirect(response);
  if (response.type === 'opaqueredirect') {
    console.info('opaqueredirect'); // Stop processing request if its an opaqueredirect

    return;
  }


  if (response.status === 401) {
    requestRunning = false;
    handleUnauthorized(response);

    return;
  }

if (response.status === 429) {
  try {
    const token = await captchaChallenge(); // shows overlay, disables background, validates, cleans up
    return backendRequest(
      url,
      {
        ...options,
        headers: {
          ...options.headers,
          'cf-turnstile-token': token,
          'cf-session-token': localStorage.getItem('session-token') ?? '',
        },
      },
      onSuccess,
      onError,
      onRedirect,
      requestType,
      handleUnauthorized,
      true,
      retrialNum,
      extras
    );
  } catch (e) {
    onError?.({ error: 'Captcha challenge failed', detail: e });
    requestRunning = false;
    return;
  }
}


  try {
    let jsonResponse = {}

    try {
      jsonResponse = await response.json();
    } catch (e) {
      jsonResponse = { error: 'Unexpected response', expected: false }

      console.error('Unexpected response', e, response);
    }

    if (response.ok) {
      onSuccess?.(jsonResponse);
      return;
    } else {
      onError?.(jsonResponse);
    }
  } catch (err) {
    console.error(err);
  } finally {
    requestRunning = false;
  }
}

const post = (endpoint: string, params: any, onSuccess: any, onError: any, onRedirect?: any, requestType: string = "query", handleUnauthorized?: any) => {
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }

  if (params) {
    let content = params;
    if (!(params instanceof File)) {
      content = JSON.stringify(params);
    }
    // @ts-ignore
    options.body = content;
  }

  return apiRequest(endpoint, options, onSuccess, onError, onRedirect, requestType, handleUnauthorized);
}

const get = (endpoint: string, onSuccess: any, onError: any, onRedirect?: any, handleUnauthorized?: any) => {
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }

  return apiRequest(endpoint, options, onSuccess, onError, onRedirect, 'query', handleUnauthorized);
}

export const backendPost = (endpoint: string, postContent: any, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any, handleUnauthorized?: any): void => {
  post(endpoint, postContent, onJsonResponse, onHelpMessage, null, 'command', handleUnauthorized);
}

export const backendGet = (endpoint: string, params: any, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any, handleUnauthorized?: any): void => {
  if (params) {
    endpoint += '?';
    Object.keys(params).forEach((k, i) => {
      if (i > 0) endpoint += '&';
      endpoint += `${k}=${params[k]}`;
    });
  }
  get(endpoint, onJsonResponse, onHelpMessage, null, handleUnauthorized);
}

export const requestMagicLink = (
  data: any,
  onJsonResponse: (response: any) => any,
  onUnauthorized: () => void
): void => {
  const { email, token } = data;
  const url =
    getMagicAuthReqUrl() +
    encodeURIComponent(email) +
    '&destination=' +
    extractTokenFromWindowLocation('destination') +
    '&token=' +
    token;
  const options = {};

  backendRequest(
    url,
    options,
    onJsonResponse,
    console.error,
    undefined,    // ← use undefined instead of null
    'query',
    onUnauthorized
  );
};

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

export const getSSOAuthorizationEndpoint = (onSuccess: (response: any) => any, onError: (message: string) => any) => {
  backendGet('openid/authorization-endpoint', null, onSuccess, onError);
}

export const validateSSOToken = (token: string, redirectUri: string, onLogin: (response: any) => any, onError: (message: string) => any, handleUnauthorized: (response: any) => void) => {
  backendGet('openid/callback', { code: token, 'redirect-uri': redirectUri }, onLogin, onError, handleUnauthorized);
}

export const authPasswordLogin = (credentials: any, onLogin: (response: any) => any, onLoginError: (message: string) => any, handleUnauthorized: (response: any) => void) => {
  backendPost('auth-password', credentials, onLogin, onLoginError, handleUnauthorized);
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
