import { applyFormattedTranslation, getTranslation } from '../jux/language';
import { basePage } from './base-page';
import { loginTokenTextarea } from './login-token-textarea';
import { backButton } from './back-button';

export const magicLinkRequestedPage = (backgroundImg: string, onReturn: any, onUserLogin: any, onLoginError: any): HTMLElement => {
  const title = document.createElement('h2');
  title.textContent = getTranslation('magic-link-confirmation-title');
  title.style.fontSize = '24px';
  title.style.lineHeight = '1.25';
  title.style.margin = '0 0 16px';

  const sent = document.createElement('p');
  sent.id = 'magic-link-sent';
  sent.textContent = getTranslation(sent.id);
  sent.style.margin = '0';

  const email = document.createElement('p');
  email.id = 'magic-link-email';
  email.style.fontWeight = '700';
  email.style.margin = '4px 0 0';
  email.style.overflowWrap = 'anywhere';

  const tokenInput = loginTokenTextarea(onUserLogin, onLoginError);
  tokenInput.style.textAlign = 'left';
  tokenInput.style.marginTop = '24px';

  const help = document.createElement('p');
  applyFormattedTranslation(help, 'magic-link-check-spam');
  help.style.margin = '24px 0 0';

  const back = backButton('Back', () => {
    result.remove();
    onReturn();
  });
  back.style.marginTop = '24px';

  const content = [title, sent, email, tokenInput, help];
  content.forEach(element => {
    element.style.width = '356px';
    element.style.maxWidth = '100%';
  });
  const result = basePage('magic-link-requested-page', backgroundImg, content);
  result.style.overflowY = 'auto';
  result.style.scrollbarGutter = 'stable both-edges';

  const section = result.querySelector('section') as HTMLElement;
  section.style.maxWidth = 'calc(100% - 48px)';
  section.style.lineHeight = '1.5';
  section.style.textAlign = 'center';

  const buttons = result.querySelector('btns-container') as HTMLElement;
  buttons.style.width = '356px';
  buttons.style.maxWidth = '100%';
  buttons.appendChild(back);

  return result;
}
