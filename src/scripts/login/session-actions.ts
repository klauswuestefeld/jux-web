import { setLocalStorageItem, removeLocalStorageItem } from '../local-storage/utils';
import { resetJuxWebGlobal } from '../jux/jux-web-global/utils';

export const setBackendToken = (token: string): void => {
  window.juxWebGlobal?.setBackendToken(token);
  if (token) setLocalStorageItem('token', token);
};

export const clearSession = () => {
  removeLocalStorageItem('token');
  resetJuxWebGlobal();
};

export const onTokenAcquired = (token: string, onUserLogin: any) => {
  setBackendToken(token);
  onUserLogin();
};
