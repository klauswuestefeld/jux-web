export class JuxEvent extends Event {
  public requestType: string;
  public method: string;
  public endpoint: string;
  public onResult?: (result: any) => any;
  public params: any;
  public onError?: (error: any) => void;
  public onRedirect?: (result: any) => any;
  public extras?: any;

  constructor(
    type: string,
    method: string,
    endpoint: string,
    onResult?: (result: any) => any,
    params?: any,
    onError?: (error: any) => void,
    onRedirect?: (result: any) => any,
    extras?: {}
  ) {
    super('jux-event', { bubbles: true, cancelable: true, composed: true });
    this.requestType = type;
    this.method = method;
    this.endpoint = endpoint;
    this.onResult = onResult;
    this.params = params;
    this.onError = onError;
    this.onRedirect = onRedirect;
    this.extras = extras;
  }
}

export const query = (element: HTMLElement, endpoint: string, onResult: (result: any) => any, params?: any, onError?: (error: any) => void, onRedirect?: (result: any) => any) => {
  element.dispatchEvent(new JuxEvent('query', 'POST', endpoint, onResult, params, onError, onRedirect));
}

export const command = (element: HTMLElement, endpoint: string, onResult?: (result: any) => any, params?: any, onError?: (error: any) => void, onRedirect?: (result: any) => any) => {
  element.dispatchEvent(new JuxEvent('command', 'POST', endpoint, onResult, params, onError, onRedirect));
}

export const upload = (
  element: HTMLElement,
  endpoint: string,
  file: File,
  onResult?: (result: any) => any,
  onError?: (error: any) => void,
  extras?: {
    onProgress?: (percent: number) => void;
    onStart?: () => void;
  }) => {
  element.dispatchEvent(new JuxEvent('upload', 'POST', endpoint, onResult, undefined, onError, undefined, {...extras, file}));
}
