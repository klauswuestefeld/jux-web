import { getTranslation } from '../jux/language';
import { juxModal } from '../jux-modal';
import { magicEmailField } from './magic-email-field';

export const magicLinkModal = (onUserLogin: any, onReturn: any, backgroundImage: string, currentPage: HTMLElement, clientBody: HTMLElement, loginTypes: string[]): HTMLElement => {
  const result = document.createElement('magic-link-modal');

  const subtitle = document.createElement('magic-link-request-subtitle');
  subtitle.style.fontSize = '14px';
  subtitle.textContent = getTranslation('magic-link-request-subtitle');

  const body = document.createElement('magic-link-request-body');
  body.append(
    subtitle,
    magicEmailField(
      onUserLogin,
      onReturn,
      backgroundImage,
      currentPage,
      clientBody,
      () => result.remove(),
      loginTypes
    )
  );

  const modal = juxModal(
    getTranslation('magic-link-request-title'),
    [],
    '',
    false,
    false,
    body,
    '',
    '',
    () => result.remove()
  );
  modal.setAttribute('data-cy', 'magic-link-modal');

  result.appendChild(modal);
  const wrapper = modal.querySelector('modal-wrapper') as HTMLElement;
  wrapper.style.maxWidth = '360px';
  wrapper.style.width = '100%';

  return result;
}
