import { getTranslation } from '../jux/language';
import { juxModal } from '../jux-modal';
import { loginButton } from './login-button';

export const socialLoginModal = (userEmail: string, mailExchanger: string, token: any, onUserLogin: any, onReturn: any, backgroundImage: string, currentPage: HTMLElement, clientBody: HTMLElement, closeMagicLinkModal: any, handlers: { onGoogleSignIn: any; onMicrosoftSignIn: any; handleMagicLinkRequest: any; }): HTMLElement => {
  const result = document.createElement('social-login-modal');

  const email = document.createElement('p');
  email.textContent = `"${userEmail}"`;

  const msg = document.createElement('social-login-msg');
  msg.textContent = getTranslation('social-login-recommendation') + mailExchanger + '.' + getTranslation('social-login-advantage');

  const body = document.createElement('social-login-body');
  const socialLoginBtn = mailExchanger === 'Microsoft' ?
    loginButton('Microsoft', () => handlers.onMicrosoftSignIn(onUserLogin)) :
    loginButton('Google', () => handlers.onGoogleSignIn(onUserLogin));

  const proceedMagicLinkRequest = document.createElement('a');
  proceedMagicLinkRequest.textContent = getTranslation('proceed-magic-link-request');
  proceedMagicLinkRequest.addEventListener('click', () => {
    handlers.handleMagicLinkRequest(token, onReturn, backgroundImage, currentPage, clientBody, userEmail);
    closeMagicLinkModal();
    result.remove();
  });

  body.append(
    email,
    msg,
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

  const wrapper = modal.querySelector('modal-wrapper') as HTMLElement;
  wrapper.style.maxWidth = '360px';
  wrapper.style.width = '100%';

  return result;
}
