import { contactUsModal } from '../contact-us/contact-us-modal';
import { getTranslation } from '../jux/language';

const applyPageStyles = (page: HTMLElement, backgroundImg: string) => {
  page.style.backgroundImage = `url(${backgroundImg})`;
  page.style.display = 'block';
  page.style.width = '100%';
  page.style.height = '100%';
  page.style.backgroundPosition = '50%';
  page.style.backgroundSize = 'cover';
  page.style.display = 'block';
}

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
  const result = document.createElement('magic-link-requested-page');

  const section = document.createElement('section');
  applyContainerStyles(section);

  const magicLinkSent = document.createElement('p');
  magicLinkSent.id = 'magic-link-sent';
  magicLinkSent.textContent = getTranslation(magicLinkSent.id);
  magicLinkSent.style.marginBottom = '10px';

  const magicLinkEmail = document.createElement('p');
  magicLinkEmail.id = 'magic-link-email';
  magicLinkEmail.style.fontWeight = '700';
  magicLinkEmail.style.marginBottom = '10px';

  const magicLinkHowTo = document.createElement('p');
  magicLinkHowTo.id = 'magic-link-how-to';
  magicLinkHowTo.innerHTML = getTranslation(magicLinkHowTo.id);
  magicLinkHowTo.style.padding = '0 30px';
  magicLinkHowTo.style.textAlign = 'center';

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

  section.append(magicLinkSent, magicLinkEmail, magicLinkHowTo, btn, returnLink);
  applyPageStyles(result, backgroundImg);
  result.appendChild(section);

  return result;
}
