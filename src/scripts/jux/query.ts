class Query extends Event {
    public params: any;
    public onResult: (result: any) => void;
    public onError?: (error: any) => void;

    constructor(endpoint: string, onResult: (result: any) => void, params?: any, onError?: (error: any) => void) {
        super(endpoint); // if needed, it is possible to modify bubbles, cancelable and composed properties
        this.params = params;
        this.onResult = onResult;
        this.onError = onError;
    }
}

export const query = (element: HTMLElement, endpoint: string, onResult: (result: any) => void, params?: any, onError?: (error: any) => void) => {
    element.dispatchEvent(new Query(endpoint, onResult, params, onError));
}
