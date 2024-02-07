import { getTranslation } from '../jux/language';
import { basePage } from './base-page';

export const unauthorizedMagicLinkRequestPage = (backgroundImg: string, onReturn: any): HTMLElement => {
  const content = [];

  const notSent = document.createElement('p');
  notSent.id = 'magic-link-not-sent';
  notSent.textContent = getTranslation(notSent.id);
  notSent.style.marginBottom = '10px';

  const email = document.createElement('p');
  email.id = 'magic-link-email';
  email.style.fontWeight = '700';
  email.style.marginBottom = '10px';

  const info = document.createElement('p');
  info.id = 'magic-link-fail-info';
  info.innerHTML = getTranslation(info.id);
  info.style.padding = '0 30px';
  info.style.textAlign = 'center';

  const back = document.createElement('a');
  back.textContent = getTranslation('return-link');
  back.onclick = () => {
    result.remove();
    onReturn();
  };
  back.style.marginTop = '32px';
  back.style.cursor = 'pointer';
  back.style.fontWeight = '700';
  back.style.textDecoration = 'underline';

  content.push(notSent, email, info, back);
  const result = basePage('unauthorized-magic-link-request-page', backgroundImg, content);

  return result;
}
