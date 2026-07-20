import { backendGet } from '../api-client';
import { onTokenAcquired } from './session-actions';

const applyLoginTokenTextareaStyle = (textarea: HTMLTextAreaElement): void => {
  textarea.style.background = '#fff';
  textarea.style.border = '1px solid #ccc';
  textarea.style.borderRadius = '8px';
  textarea.style.boxShadow = 'inset 0 2px 3px #28282822';
  textarea.style.boxSizing = 'border-box';
  textarea.style.color = '#444';
  textarea.style.fontFamily = 'Helvetica, Arial, sans-serif';
  textarea.style.fontSize = '16px';
  textarea.style.height = '40px';
  textarea.style.lineHeight = '38px';
  textarea.style.margin = '0';
  textarea.style.overflow = 'hidden';
  textarea.style.padding = '0 12px';
  textarea.style.resize = 'none';
  textarea.style.width = '100%';
  textarea.style.setProperty('-webkit-text-security', 'disc');
};

export const loginTokenTextarea = (onUserLogin: any, onLoginError: any): HTMLTextAreaElement => {
  const juxWebGlobal = window.juxWebGlobal!;
  const textarea = document.createElement('textarea');
  textarea.id = 'input-login-token';
  textarea.autocomplete = 'off';
  textarea.placeholder = 'Paste login token';
  textarea.rows = 1;
  textarea.spellcheck = false;
  textarea.setAttribute('aria-label', 'Login token');
  applyLoginTokenTextareaStyle(textarea);

  textarea.addEventListener('focus', () => {
    textarea.style.outline = '2px solid #3943B7';
    textarea.style.outlineOffset = '-2px';
  });
  textarea.addEventListener('blur', () => {
    textarea.style.outline = 'none';
  });

  let loginInProgress = false;
  textarea.addEventListener('input', () => {
    const loginToken = textarea.value.trim();
    if (loginToken.length !== 12 || loginInProgress) return;

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
