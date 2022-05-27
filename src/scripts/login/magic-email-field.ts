import { getMXData } from '../api-client';
import { googleCaptcha } from '../captcha/google-captcha';
import { getTranslation } from '../jux/language';
import { juxDarkGrey, juxDimmedDarkGrey, juxLightGreen, juxWhite } from '../style-constants';
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

const applyMagicEmailFieldStyle = (el: HTMLElement) => {
  el.style.display = 'flex';
  el.style.flexFlow = 'column';
  el.style.marginTop = '8px';
  el.style.rowGap = '8px';
  el.style.width = '100%';
}

const applyInputStyle = (input: HTMLInputElement) => {
  input.style.border = `1px solid ${juxDarkGrey}`;
  input.style.maxWidth = '390px';
  input.style.padding = '10px';
  input.style.width = '100%';
  input.style.backgroundColor = juxWhite;
  input.style.borderRadius = '8px';
  input.style.boxShadow = `inset 0 2px 3px ${juxDimmedDarkGrey}`;
  input.style.height = '40px';
  input.style.whiteSpace = 'pre-line';
  input.style.boxSizing = 'border-box';
}

const applyBtnStyle = (btn: HTMLButtonElement) => {
  btn.style.alignSelf = 'flex-end';
  btn.style.backgroundColor = juxLightGreen;
  btn.style.border = `2px solid ${juxLightGreen}`;
  btn.style.borderRadius = '8px';
  btn.style.color = juxWhite;
  btn.style.cursor = 'pointer';
  btn.style.display = 'inline-block';
  btn.style.fontWeight = '700';
  btn.style.height = '40px';
  btn.style.lineHeight = '1';
  btn.style.marginLeft = '10px';
  btn.style.padding = '10px 16px';
  btn.style.position = 'relative';
}

export const magicEmailField = (onUserLogin: any, onReturn: any): HTMLElement => {
  const result = document.createElement('magic-email-field');
  applyMagicEmailFieldStyle(result);

  const captcha = googleCaptcha();

  const input = document.createElement('input');
  input.id = 'mail-magic';
  input.type = 'text';
  input.className = 'textfield';
  input.placeholder = 'e-mail';
  applyInputStyle(input);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      onMagicLinkRequest(captcha.getAttribute('token'), input, onUserLogin, onReturn);
    }
  });

  const btn = document.createElement('button');
  applyBtnStyle(btn);
  btn.id = 'send-magic';
  btn.className = 'primary-button';
  btn.addEventListener('click', (_ev) => onMagicLinkRequest(captcha.getAttribute('token'), input, onUserLogin, onReturn));
  btn.textContent = getTranslation('send-magic');

  result.append(input, captcha, btn);

  return result;
}
