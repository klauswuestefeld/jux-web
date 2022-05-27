export declare const setBackendToken: (token: string) => void;
export declare const onTokenAcquired: (token: string, onUserLogin: any) => void;
export declare const onMicrosoftSignIn: (onUserLogin: any) => Promise<void>;
export declare const onGoogleSignIn: (onUserLogin: any) => void;
export declare const handleMagicLinkRequest: (token: string | null, onReturn: any, email?: string) => void;
