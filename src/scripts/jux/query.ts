class QueryInit implements CustomEventInit {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
    payload: any;
    onResult: any;
    onError: any;
    
    constructor(payload: any, onResult: any, onError?: any) {
        this.payload = payload;
        this.onResult = onResult;
        this.onError = onError;
    }
}

class Query<T> extends CustomEvent<T> {
    constructor(endpoint: string, onResult: any, params?: any, onError?: any) {
        const payload = new QueryInit(params, onResult, onError);
        super(endpoint, payload);
    }
}

export const query = (element: HTMLElement, endpoint: string, onResult: any, params?: any, onError?: any) => {
    element.dispatchEvent(new Query(endpoint, onResult, params, onError));
}
