import { getMXData } from '../api-client';
import { googleCaptcha } from '../captcha/google-captcha';
import { getTranslation } from '../jux/language';
import { juxDimmedDarkGrey, juxLightGreen, juxWhite } from '../style-constants';
import { socialLoginModal } from './social-login';
import { isValidEmail } from './utils/string';

const recommendSocialLogin = (userEmail: string, mailExchanger: string, token: any, onUserLogin: any, onReturn: any, backgroundImage: string, currentPage: HTMLElement, clientBody: HTMLElement, closeMagicLinkModal: any, handlers: any) => {
  document.querySelector('magic-link-modal')?.remove();
  document.body.appendChild(socialLoginModal(userEmail, mailExchanger, token, onUserLogin, onReturn, backgroundImage, currentPage, clientBody, closeMagicLinkModal, handlers));
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

export const onMagicLinkRequest = async (token: any, input: HTMLInputElement, onUserLogin: any, onReturn: any, backgroundImage: string, currentPage: HTMLElement, clientBody: HTMLElement, closeMagicLinkModal: any, loginTypes: string[], handlers: { handleMagicLinkRequest: any; }) => {
  const email = input.value;
  if (!email.includes('-test@') && !token) {
    console.error('invalid-captcha-response');
    // logError('invalid-captcha-response');

    return;
  }

  if (isValidEmail(email)) {
    const domain = email.split('@')[1] || '';
    const mailExchanger = await getMailExchanger(domain);
    const supportedMailExchanger = mailExchanger !== null;

    if (supportedMailExchanger && loginTypes.includes(mailExchanger)) {
      recommendSocialLogin(email, mailExchanger, token, onUserLogin, onReturn, backgroundImage, currentPage, clientBody, closeMagicLinkModal, handlers);

      return;
    }
  }

  handlers.handleMagicLinkRequest(
    token,
    onReturn,
    backgroundImage,
    currentPage,
    clientBody
  );

  closeMagicLinkModal();
}

const applyMagicEmailFieldStyle = (el: HTMLElement) => {
  el.style.display = 'flex';
  el.style.flexFlow = 'column';
  el.style.marginTop = '8px';
  el.style.rowGap = '8px';
  el.style.width = '100%';
}

const applyInputStyle = (input: HTMLInputElement) => {
  input.style.border = '1px solid #ccc';
  input.style.borderRadius = '8px';
  input.style.boxShadow = `inset 0 2px 3px ${juxDimmedDarkGrey}`;
  input.style.boxSizing = 'border-box';
  input.style.color = '#444';
  input.style.fontFamily = 'Helvetica, Arial, sans-serif';
  input.style.fontSize = '16px';
  input.style.height = '40px';
  input.style.lineHeight = '38px';
  input.style.maxWidth = '390px';
  input.style.padding = '0 12px';
  input.style.width = '100%';
  input.style.backgroundColor = juxWhite;
  input.style.whiteSpace = 'pre-line';
}

const applyCaptchaStyle = (captcha: HTMLElement) => {
  const captchaFrameWidth = 304;
  const captchaHeight = 78;
  const contentWidth = 356;
  const horizontalInset = 1;
  const scale = (contentWidth - horizontalInset * 2) / captchaFrameWidth;

  captcha.style.height = `${captchaHeight * scale}px`;
  captcha.style.overflow = 'visible';
  captcha.style.width = '100%';

  const applyWidgetStyle = () => {
    const widget = captcha.firstElementChild as HTMLElement;
    widget.style.marginLeft = `${horizontalInset}px`;
    widget.style.width = `${captchaFrameWidth}px`;
    widget.style.transform = `scale(${scale})`;
    widget.style.transformOrigin = 'top left';
  };

  if (captcha.firstElementChild) {
    applyWidgetStyle();
  } else {
    captcha.addEventListener('captcha-rendered', applyWidgetStyle, { once: true });
  }
}

const applyBtnStyle = (btn: HTMLButtonElement) => {
  btn.style.alignSelf = 'flex-end';
  btn.style.backgroundColor = juxLightGreen;
  btn.style.border = `2px solid ${juxLightGreen}`;
  btn.style.borderRadius = '8px';
  btn.style.boxSizing = 'border-box';
  btn.style.color = juxWhite;
  btn.style.cursor = 'pointer';
  btn.style.display = 'inline-block';
  btn.style.fontSize = '16px';
  btn.style.fontWeight = '700';
  btn.style.height = '40px';
  btn.style.lineHeight = '1';
  btn.style.marginLeft = '10px';
  btn.style.padding = '10px 16px';
  btn.style.position = 'relative';
}

export const magicEmailField = (
  onUserLogin: any,
  onReturn: any,
  backgroundImage: string,
  currentPage: HTMLElement,
  clientBody: HTMLElement,
  closeMagicLinkModal: any,
  loginTypes: string[],
  handlers: {
    handleMagicLinkRequest: any;
  }
): HTMLElement => {

  const result = document.createElement('magic-email-field');
  applyMagicEmailFieldStyle(result);

  const captcha = googleCaptcha();
  applyCaptchaStyle(captcha);

  const input = document.createElement('input');
  input.id = 'mail-magic';
  input.type = 'text';
  input.className = 'textfield';
  input.placeholder = 'e-mail';
  applyInputStyle(input);

  const btn = document.createElement('button');
  applyBtnStyle(btn);
  btn.id = 'send-magic';
  btn.className = 'primary-button';
  btn.addEventListener('click', () => onMagicLinkRequest(captcha.getAttribute('token'), input, onUserLogin, onReturn, backgroundImage, currentPage, clientBody, closeMagicLinkModal, loginTypes, handlers));
  btn.textContent = getTranslation('send-magic');

  const updateButtonState = () => {
    const hasCaptcha = captcha.hasAttribute('token') || input.value.includes('-test@');
    btn.disabled = !isValidEmail(input.value) || !hasCaptcha;
    btn.style.cursor = btn.disabled ? 'not-allowed' : 'pointer';
    btn.style.opacity = btn.disabled ? '0.5' : '1';
  };
  input.addEventListener('input', updateButtonState);
  captcha.addEventListener('captcha-change', updateButtonState);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && !btn.disabled) btn.click();
  });
  updateButtonState();

  result.append(input, captcha, btn);

  return result;
}
