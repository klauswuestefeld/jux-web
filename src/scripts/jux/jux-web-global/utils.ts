import { CurrentUser, JuxWebGlobal } from '../jux-web-global';

export const resetJuxWebGlobal = (): void => {
  window.juxWebGlobal = new JuxWebGlobal();
}

export const getCurrentUser = (): CurrentUser | undefined => {
  return window.juxWebGlobal?.getCurrentUser();
}
