import { JuxWebGlobal } from './jux/jux-web-global';

export {};

declare global {
  interface Window {
    juxWebGlobal?: JuxWebGlobal
  }
}
