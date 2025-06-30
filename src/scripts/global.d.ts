export {};

declare global {
  interface Window {
    juxwebGlobal?: {
      backendToken?: string;
    };
  }
}
