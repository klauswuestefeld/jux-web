export class JuxEvent extends Event {
    public method: string;
    public endpoint: string;
    public onResult?: (result: any) => any;
    public params: any;
    public onError?: (error: any) => void;

    constructor(method: string, endpoint: string, onResult?: (result: any) => any, params?: any, onError?: (error: any) => void) {
        super('jux-event'); // in the future maybe we might need to modify bubbles, cancelable and composed properties
        this.method = method;
        this.endpoint = endpoint;
        this.onResult = onResult;
        this.params = params;
        this.onError = onError;
    }
}

export const query = (element: HTMLElement, endpoint: string, onResult: (result: any) => any, params?: any, onError?: (error: any) => void) => {
    element.dispatchEvent(new JuxEvent('GET', endpoint, onResult, params, onError));
}

export const command = (element: HTMLElement, endpoint: string, onResult?: (result: any) => any, params?: any, onError?: (error: any) => void) => {
    element.dispatchEvent(new JuxEvent('POST', endpoint, onResult, params, onError));
}
