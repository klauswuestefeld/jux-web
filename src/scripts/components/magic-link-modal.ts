import { getTranslation } from '../i18n';
import { magicEmailField } from './magic-email-field';
import { percyModal } from './percy-modal';
import { percySpacer } from './percy-spacer';

export const magicLinkModal = (): HTMLElement => {
  const result = document.createElement('magic-link-modal');

  const subtitle = document.createElement('magic-link-request-subtitle');
  subtitle.textContent = getTranslation('magic-link-request-subtitle');

  const body = document.createElement('magic-link-request-body');
  body.append(subtitle, percySpacer({ vertical: 12 }), magicEmailField());

  const modal = percyModal(
    getTranslation('magic-link-request-title'),
    [],
    '',
    false,
    false,
    body,
    '',
    '',
    () => result.remove());
  modal.setAttribute('data-cy', 'magic-link-modal');

  result.appendChild(modal);
  modal.querySelector('modal-wrapper')?.setAttribute('style', 'max-width: 360px; width: 100%;');

  return result;
}
