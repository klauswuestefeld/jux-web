import { contactUsModal } from '../contact-us/contact-us-modal';
import { getTranslation } from '../jux/language';

const applyContainerStyles = (container: HTMLElement) => {
  container.style.backgroundColor = '#ffffffdd';
  container.style.borderRadius = '16px';
  container.style.inset = '50% 50% 50% 0';
  container.style.position = 'relative';
  container.style.transform = 'translateY(-50%)';
  container.style.width = '620px';
  container.style.alignItems = 'center';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.fontSize = '16px';
  container.style.height = '100%';
  container.style.justifyContent = 'center';
  container.style.margin = '0 auto';
  container.style.paddingTop = '0';
}

export const magicLinkRequestedPage = (backgroundImg: string, onReturn: any): HTMLElement => {
  const result = document.createElement('magic-link-requested-page');

  const section = document.createElement('section');
  applyContainerStyles(section);

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
    result.remove();
    onReturn();
  };

  section.append(magicLinkSent, magicLinkEmail, magicLinkHowTo, btn, returnLink);
  result.style.backgroundImage = backgroundImg;
  result.appendChild(section);

  return result;
}
