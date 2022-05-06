import { displayPage, Page } from '../utils/navigation';
import { getTranslation } from '../i18n';
import { contactUsModal } from '../components/contact-us-modal';

export const magicLinkRequestedPage = (backgroundImg: string): HTMLElement => {
  const result = document.createElement('magic-link-requested-page');

  const container = document.createElement('percy-container');

  const magicLinkSent = document.createElement('p');
  magicLinkSent.id = 'magic-link-sent';
  magicLinkSent.textContent = getTranslation(magicLinkSent.id);

  const magicLinkEmail = document.createElement('p');
  magicLinkEmail.id = 'magic-link-email';
  magicLinkEmail.setAttribute('class', 'strong');

  const magicLinkHowTo = document.createElement('p');
  magicLinkHowTo.id = 'magic-link-how-to';
  magicLinkHowTo.innerHTML = getTranslation(magicLinkHowTo.id);

  const btn = document.createElement('button');
  btn.id = 'email-not-received-btn';
  btn.addEventListener('click', () => document.querySelector('percy-body')?.appendChild(contactUsModal('email-not-sent')));
  btn.textContent = getTranslation('magic-link-let-us-know');

  const returnLink = document.createElement('a');
  returnLink.textContent = getTranslation('return-link');
  returnLink.onclick = () => {
    displayPage(Page.LOGIN);
  };

  container.append(magicLinkSent, magicLinkEmail, magicLinkHowTo, btn, returnLink);
  result.style.backgroundImage = `url(${backgroundImg})`;
  result.appendChild(container);

  return result;
}
