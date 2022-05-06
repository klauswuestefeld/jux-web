import { getTranslation } from '../i18n';
import { handleMagicLinkRequest } from '../session';
import { socialLoginModal } from './social-login-modal';
import { isValidEmail } from '../utils/string';
import { googleCaptcha } from './google-captcha';
import { getMXData } from '../api-client';

const recommendSocialLogin = (userEmail: string, mailExchanger: string, token: any) => {
  document.querySelector('magic-link-modal')?.remove();
  document.querySelector('percy-body')?.appendChild(socialLoginModal(userEmail, mailExchanger, token));
}

const hasProvider = (data: any, provider: string) => {
  return data.some((entry: string) => entry.includes(provider));
}

const getMailExchanger = async (domainName: string): Promise<any> => {
  const data = await getMXData(domainName);

  if (!data) return null;
  if (hasProvider(data, 'outlook.com')) return 'Microsoft';
  if (hasProvider(data, 'google.com')) return 'Google';

  return null;
}

const onMagicLinkRequest = async (token: any, input: HTMLInputElement, errorHandler: () => void) => {
  const email = input.value;

  if (!email.includes('-test@') && !token) {
    errorHandler();

    return;
  }

  if (isValidEmail(email)) {
    const domain = email.split('@')[1] || '';
    const mailExchanger = await getMailExchanger(domain);
    const supportedMailExchanger = mailExchanger !== null;

    if (supportedMailExchanger) {
      recommendSocialLogin(email, mailExchanger, token);

      return;
    }
  }

  handleMagicLinkRequest(token);
}

export const magicEmailField = (): HTMLElement => {
  const result = document.createElement('magic-email-field');

  const captcha = googleCaptcha();

  const input = document.createElement('input');
  input.id = 'mail-magic';
  input.type = 'text';
  input.setAttribute('class', 'textfield');
  input.placeholder = 'e-mail';

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      onMagicLinkRequest(captcha.getAttribute('token'), input, () => {});
    }
  });

  const btn = document.createElement('button');
  btn.id = 'send-magic';
  btn.setAttribute('class', 'primary-button');
  btn.addEventListener('click', (_ev) => onMagicLinkRequest(captcha.getAttribute('token'), input, () => {}));
  btn.textContent = getTranslation('send-magic');

  result.append(input, captcha, btn);

  return result;
}
