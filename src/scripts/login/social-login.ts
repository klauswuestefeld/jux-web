import { getTranslation } from '../i18n';
import { juxModal } from '../jux-modal';
import { loginButton } from './login-button';
import { handleMagicLinkRequest, onGoogleSignIn, onMicrosoftSignIn } from './session';

export const socialLoginModal = (userEmail: string, mailExchanger: string, token: any, onUserLogin: any): HTMLElement => {
  const result = document.createElement('social-login-modal');

  const email = document.createElement('p');
  email.textContent = `"${userEmail}"`;

  const msg = document.createElement('social-login-msg');
  msg.textContent = getTranslation('social-login-recommendation') + mailExchanger + '.' + getTranslation('social-login-advantage');

  const body = document.createElement('social-login-body');
  const socialLoginBtn = mailExchanger === 'Microsoft' ?
    loginButton('Microsoft', () => onMicrosoftSignIn(onUserLogin)) :
    loginButton('Google', () => onGoogleSignIn(onUserLogin));

  const proceedMagicLinkRequest = document.createElement('a');
  proceedMagicLinkRequest.textContent = getTranslation('proceed-magic-link-request');
  proceedMagicLinkRequest.addEventListener('click', () => {
    handleMagicLinkRequest(token, userEmail);
    result.remove();
  });

  body.append(
    email,
    msg,
    // percySpacer({ vertical: 12 }),
    socialLoginBtn,
    proceedMagicLinkRequest
  );

  const modal = juxModal(
    getTranslation(`using-${mailExchanger.toLowerCase()}-email`),
    [],
    '',
    false,
    false,
    body,
    '',
    '',
    () => result.remove()
  );
  modal.setAttribute('data-cy', 'social-login-modal');

  result.appendChild(modal);
  modal.querySelector('modal-wrapper')?.setAttribute('style', 'max-width: 360px; width: 100%;');

  return result;
}
