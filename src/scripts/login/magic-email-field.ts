import { getMXData } from '../api-client';
import { googleCaptcha } from '../captcha/google-captcha';
import { getTranslation } from '../jux/language';
import { juxModal } from '../jux-modal';
import { juxDarkGrey, juxLightGreen, juxWhite } from '../style-constants';
import { applyTextFieldStyle } from './login-field-style';
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
  el.style.alignItems = 'center';
  el.style.display = 'flex';
  el.style.flexFlow = 'row';
  el.style.gap = '8px';
  el.style.marginTop = '8px';
  el.style.width = '100%';
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
  btn.style.padding = '10px 16px';
  btn.style.position = 'relative';
}

const captchaModal = (onVerified: (token: string) => void, onClose: () => void): HTMLElement => {
  const body = document.createElement('captcha-modal-body');
  body.style.width = '356px';

  const modal = juxModal(
    'Security check',
    [],
    '',
    false,
    false,
    body,
    '',
    '',
    onClose
  );
  modal.id = 'magic-email-captcha-modal';

  const wrapper = modal.querySelector('modal-wrapper') as HTMLElement;
  wrapper.style.maxWidth = '356px';
  wrapper.style.minWidth = '356px';
  wrapper.style.width = '356px';
  (modal.querySelector('modal-header h3') as HTMLElement).style.color = juxDarkGrey;

  document.body.appendChild(modal);

  const captcha = googleCaptcha();
  applyCaptchaStyle(captcha);
  captcha.addEventListener('captcha-change', () => {
    const token = captcha.getAttribute('token');
    if (!token) return;

    modal.remove();
    onVerified(token);
  });
  body.appendChild(captcha);

  return modal;
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

  const input = document.createElement('input');
  input.id = 'mail-magic';
  input.type = 'text';
  input.placeholder = 'Email';
  applyTextFieldStyle(input);
  input.style.flex = '1';
  input.style.minWidth = '0';

  const btn = document.createElement('button');
  applyBtnStyle(btn);
  btn.id = 'send-magic';
  btn.className = 'primary-button';
  btn.textContent = getTranslation('send-magic');

  let openCaptchaModal: HTMLElement | null = null;
  const requestMagicLink = (token: string | null) => onMagicLinkRequest(token, input, onUserLogin, onReturn, backgroundImage, currentPage, clientBody, closeMagicLinkModal, loginTypes, handlers);
  btn.addEventListener('click', () => {
    if (input.value.includes('-test@')) {
      requestMagicLink(null);
      return;
    }
    if (openCaptchaModal?.isConnected) return;

    openCaptchaModal = captchaModal(
      (token) => {
        openCaptchaModal = null;
        requestMagicLink(token);
      },
      () => openCaptchaModal = null
    );
  });

  const updateButtonState = () => {
    btn.disabled = !isValidEmail(input.value);
    btn.style.cursor = btn.disabled ? 'not-allowed' : 'pointer';
    btn.style.opacity = btn.disabled ? '0.5' : '1';
  };
  input.addEventListener('input', updateButtonState);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && !btn.disabled) btn.click();
  });
  updateButtonState();

  result.append(input, btn);

  return result;
}
