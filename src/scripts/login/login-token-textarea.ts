import { backendGet } from '../api-client';
import { applyLoginFieldStyle } from './login-field-style';
import { onTokenAcquired } from './session-actions';

const applyLoginTokenStyle = (textarea: HTMLTextAreaElement): void => {
  applyLoginFieldStyle(textarea);
  textarea.style.resize = 'none';
  textarea.style.setProperty('-webkit-text-security', 'disc');
};

export const loginTokenTextarea = (onUserLogin: any, onLoginError: any): HTMLTextAreaElement => {
  const juxWebGlobal = window.juxWebGlobal!;
  const textarea = document.createElement('textarea');
  textarea.id = 'input-login-token';
  textarea.autocomplete = 'off';
  textarea.placeholder = 'Paste sign-in token';
  textarea.rows = 1;
  textarea.spellcheck = false;
  textarea.setAttribute('aria-label', 'Sign-in token');
  applyLoginTokenStyle(textarea);

  let loginInProgress = false;
  textarea.addEventListener('input', () => {
    const loginToken = textarea.value.trim();
    if (loginToken.length !== 16 || loginInProgress) return;

    loginInProgress = true;
    juxWebGlobal.setBackendToken(loginToken);

    backendGet(
      'profile',
      null,
      (res: any) => {
        juxWebGlobal.setCurrentUser(res);
        onTokenAcquired(loginToken, onUserLogin);
      },
      (err: any) => {
        loginInProgress = false;
        juxWebGlobal.setBackendToken('');
        onLoginError(err);
      }
    );
  });

  return textarea;
};
