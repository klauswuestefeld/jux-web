export { chosenLanguage, reloadWithLanguageOverride, initLanguage, getTranslation } from './jux/language';
export { loginButton } from './login/login-button';
export { loginPage } from './login/login-page';
export { handleMagicLinkRequest, onMicrosoftSignIn } from './login/session';
export { requestMagicLink } from './api-client';
export { onMagicLinkRequest } from './login/magic-email-field';

declare global {
  interface Window {
    submitCaptcha: any,
  }
}
