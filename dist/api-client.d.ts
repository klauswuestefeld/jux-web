export declare const googleAuthUrl: string;
export declare const microsoftAuthUrl: string;
export declare const backendRequest: (requestType: string, url: string, postContent: any, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any) => void;
export declare const backendPost: (endpoint: string, postContent: any, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any) => void;
export declare const backendGet: (endpoint: string, onJsonResponse: (response: any) => any, onHelpMessage: (message: string) => any) => void;
export declare const backendGetPromise: (endpoint: string) => Promise<unknown>;
export declare const requestMagicLink: (data: any, onJsonResponse: (response: any) => any) => void;
export declare const getMXData: (domainName: string) => Promise<any>;
