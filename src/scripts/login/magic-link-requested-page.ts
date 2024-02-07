import { contactUsModal } from '../contact-us/contact-us-modal';
import { getTranslation } from '../jux/language';
import { basePage } from './base-page';

const applyBtnStyles = (btn: HTMLButtonElement) => {
  btn.style.cursor = 'pointer';
  btn.style.textDecoration = 'underline';
  btn.style.border = 'none';
  btn.style.backgroundColor = '';
  btn.style.background = 'none';
  btn.style.boxSizing = 'border-box';
  btn.style.margin = '0';
  btn.style.outline = 'none';
  btn.style.padding = '0';
  btn.style.whiteSpace = 'normal';
  btn.style.font = 'inherit';
}

export const magicLinkRequestedPage = (backgroundImg: string, onReturn: any): HTMLElement => {
  const content = [];

  const sent = document.createElement('p');
  sent.id = 'magic-link-sent';
  sent.textContent = getTranslation(sent.id);
  sent.style.marginBottom = '10px';

  const email = document.createElement('p');
  email.id = 'magic-link-email';
  email.style.fontWeight = '700';
  email.style.marginBottom = '10px';

  const howTo = document.createElement('p');
  howTo.id = 'magic-link-how-to';
  howTo.innerHTML = getTranslation(howTo.id);
  howTo.style.padding = '0 30px';
  howTo.style.textAlign = 'center';

  const btn = document.createElement('button');
  btn.id = 'email-not-received-btn';
  btn.addEventListener('click', () => document.body.appendChild(contactUsModal('email-not-sent')));
  btn.textContent = getTranslation('magic-link-let-us-know');
  applyBtnStyles(btn);

  const returnLink = document.createElement('a');
  returnLink.textContent = getTranslation('return-link');
  returnLink.onclick = () => {
    result.remove();
    onReturn();
  };
  returnLink.style.marginTop = '32px';
  returnLink.style.cursor = 'pointer';
  returnLink.style.fontWeight = '700';
  returnLink.style.textDecoration = 'underline';

  content.push(sent, email, howTo, btn, returnLink);
  const result = basePage('magic-link-requested-page', backgroundImg, content);

  return result;
}
