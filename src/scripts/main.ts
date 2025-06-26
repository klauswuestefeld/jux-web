export { chosenLanguage, reloadWithLanguageOverride, initLanguage, getTranslation } from './jux/language';
export { loginButton } from './login/login-button';
export { loginPage } from './login/login-page';
export { handleMagicLinkRequest, initSession, onMicrosoftSignIn, clearSession } from './login/session';
export { handleJuxEvent, requestMagicLink, upload } from './api-client';
export { magicLinkModal } from './login/magic-link-modal';
export { command, query } from './jux/jux-event';

declare global {
  interface Window {
    submitCaptcha: any,
  }
}
