import { getMXData } from '../api-client';
import { googleCaptcha } from '../captcha/google-captcha';
import { getTranslation } from '../jux/language';
import { handleMagicLinkRequest } from './session';
import { socialLoginModal } from './social-login';
import { isValidEmail } from './utils/string';

const recommendSocialLogin = (userEmail: string, mailExchanger: string, token: any, onUserLogin: any, onReturn: any) => {
  document.querySelector('magic-link-modal')?.remove();
  document.body.appendChild(socialLoginModal(userEmail, mailExchanger, token, onUserLogin, onReturn));
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

const onMagicLinkRequest = async (token: any, input: HTMLInputElement, onUserLogin: any, onReturn: any) => {
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
      recommendSocialLogin(email, mailExchanger, token, onUserLogin, onReturn);

      return;
    }
  }

  handleMagicLinkRequest(token, onReturn);
}

export const magicEmailField = (onUserLogin: any, onReturn: any): HTMLElement => {
  const result = document.createElement('magic-email-field');

  const captcha = googleCaptcha();

  const input = document.createElement('input');
  input.id = 'mail-magic';
  input.type = 'text';
  input.setAttribute('class', 'textfield');
  input.placeholder = 'e-mail';

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      onMagicLinkRequest(captcha.getAttribute('token'), input, onUserLogin, onReturn);
    }
  });

  const btn = document.createElement('button');
  btn.id = 'send-magic';
  btn.setAttribute('class', 'primary-button');
  btn.addEventListener('click', (_ev) => onMagicLinkRequest(captcha.getAttribute('token'), input, onUserLogin, onReturn));
  btn.textContent = getTranslation('send-magic');

  result.append(input, captcha, btn);

  return result;
}
