import { getMXData } from '../api-client';
import { googleCaptcha } from '../captcha/google-captcha';
import { getTranslation } from '../jux/language';
import { handleMagicLinkRequest } from './session';
import { socialLoginModal } from './social-login';
import { isValidEmail } from './utils/string';

const recommendSocialLogin = (userEmail: string, mailExchanger: string, token: any, onUserLogin: any) => {
  document.querySelector('magic-link-modal')?.remove();
  document.body.appendChild(socialLoginModal(userEmail, mailExchanger, token, onUserLogin));
}

const hasProvider = (data: any, provider: string) => {
  return data.some((entry: string) => entry.includes(provider));
}

const getMailExchanger = async (domainName: string): Promise<any> => {
  const data = await getMXData(domainName);

  if (!data) {
    return null;
  }

  if (hasProvider(data, 'outlook.com')) {
    return 'Microsoft';
  }

  if (hasProvider(data, 'google.com')) {
    return 'Google';
  }

  return null;
}

const onMagicLinkRequest = async (token: any, input: HTMLInputElement, onUserLogin: any) => {
  const email = input.value;

  if (!email.includes('-test@') && !token) {
    // logError('invalid-captcha-response');

    return;
  }

  if (isValidEmail(email)) {
    const domain = email.split('@')[1] || '';
    const mailExchanger = await getMailExchanger(domain);
    const supportedMailExchanger = mailExchanger !== null;

    if (supportedMailExchanger) {
      recommendSocialLogin(email, mailExchanger, token, onUserLogin);

      return;
    }
  }

  handleMagicLinkRequest(token);
}

export const magicEmailField = (onUserLogin: any): HTMLElement => {
  const result = document.createElement('magic-email-field');

  const captcha = googleCaptcha();

  const input = document.createElement('input');
  input.id = 'mail-magic';
  input.type = 'text';
  input.setAttribute('class', 'textfield');
  input.placeholder = 'e-mail';

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      onMagicLinkRequest(captcha.getAttribute('token'), input, onUserLogin);
    }
  });

  const btn = document.createElement('button');
  btn.id = 'send-magic';
  btn.setAttribute('class', 'primary-button');
  btn.addEventListener('click', (_ev) => onMagicLinkRequest(captcha.getAttribute('token'), input, onUserLogin));
  btn.textContent = getTranslation('send-magic');

  result.append(input, captcha, btn);

  return result;
}
