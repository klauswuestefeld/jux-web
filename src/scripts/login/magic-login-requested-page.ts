import { contactUsModal } from '../contact-us/contact-us-modal';
import { getTranslation } from '../i18n';

export const magicLinkRequestedPage = (backgroundImg: string): HTMLElement => {
  const result = document.createElement('magic-link-requested-page');

  const section = document.createElement('section');

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
  btn.addEventListener('click', () => document.body.appendChild(contactUsModal('email-not-sent')));
  btn.textContent = getTranslation('magic-link-let-us-know');

  const returnLink = document.createElement('a');
  returnLink.textContent = getTranslation('return-link');
  returnLink.onclick = () => {
    // displayPage(Page.LOGIN);
  };

  section.append(magicLinkSent, magicLinkEmail, magicLinkHowTo, btn, returnLink);
  result.style.backgroundImage = `url(${backgroundImg})`;
  result.appendChild(section);

  return result;
}
