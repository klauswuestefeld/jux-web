import { getTranslation } from '../i18n';
import { onGoogleSignIn, onMicrosoftSignIn, handleMagicLinkRequest } from '../session';
import { loginButton } from './login-button';
import { percyModal } from './percy-modal';
import { percySpacer } from './percy-spacer';

export const socialLoginModal = (userEmail: string, mailExchanger: string, token: any): HTMLElement => {
  const result = document.createElement('social-login-modal');

  const email = document.createElement('p');
  email.textContent = `"${userEmail}"`;

  const msg = document.createElement('social-login-msg');
  msg.textContent = getTranslation('social-login-recommendation') + mailExchanger + '.' + getTranslation('social-login-advantage');

  const body = document.createElement('social-login-body');
  const socialLoginBtn = mailExchanger === 'Microsoft' ?
    loginButton('microsoft.svg', onMicrosoftSignIn, 'Microsoft') :
    loginButton('googleLogo.png', onGoogleSignIn, 'Google');

  const proceedMagicLinkRequest = document.createElement('a');
  proceedMagicLinkRequest.textContent = getTranslation('proceed-magic-link-request');
  proceedMagicLinkRequest.addEventListener('click', () => {
    handleMagicLinkRequest(token, userEmail);
    result.remove();
  });

  body.append(email, msg, percySpacer({ vertical: 12 }), socialLoginBtn, proceedMagicLinkRequest);

  const modal = percyModal(
    getTranslation(`using-${mailExchanger.toLowerCase()}-email`),
    [],
    '',
    false,
    false,
    body,
    '',
    '',
    () => result.remove());
  modal.setAttribute('data-cy', 'social-login-modal');

  result.appendChild(modal);
  modal.querySelector('modal-wrapper')?.setAttribute('style', 'max-width: 360px; width: 100%;');

  return result;
}
