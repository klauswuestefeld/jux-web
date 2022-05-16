import { getTranslation } from '../i18n';
import { juxModal } from '../jux-modal';
import { magicEmailField } from './magic-email-field';

export const magicLinkModal = (onUserLogin: any): HTMLElement => {
  const result = document.createElement('magic-link-modal');

  const subtitle = document.createElement('magic-link-request-subtitle');
  subtitle.textContent = getTranslation('magic-link-request-subtitle');

  const body = document.createElement('magic-link-request-body');
  body.append(
    subtitle,
    // percySpacer({ vertical: 12 }),
    magicEmailField(onUserLogin)
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
  modal.querySelector('modal-wrapper')?.setAttribute('style', 'max-width: 360px; width: 100%;');

  return result;
}
