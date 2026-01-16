export { chosenLanguage, reloadWithLanguageOverride, initLanguage, getTranslation } from './jux/language';
export { loginButton } from './login/login-button';
export { loginPage } from './login/login-page';
export { handleMagicLinkRequest, initSession, onMicrosoftSignIn } from './login/session';
export { handleJuxEvent, requestMagicLink, upload } from './api-client';
export { magicLinkModal } from './login/magic-link-modal';
export { clearSession } from './login/session-actions'
export { command, query } from './jux/jux-event';
export { getCurrentUser, resetJuxWebGlobal } from './jux/jux-web-global/utils'

declare global {
  interface Window {
    submitCaptcha: any,
  }
}
