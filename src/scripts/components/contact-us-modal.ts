import { Length, success } from '../utils/flash';
import { backendGet, backendPost } from '../api-client';
import { getTranslation, translateTexts } from '../i18n';
import { contactField } from './contact-field';
import { googleCaptcha } from './google-captcha';
import { percyModal } from './percy-modal';

let logError: any;

const getNestedElValue = (el: HTMLElement, nestedTag: string) => {
  const nestedEl = el.querySelector(nestedTag) as HTMLInputElement | HTMLTextAreaElement;
  return nestedEl.value;
};

const sendInquiry = (
  name: HTMLElement,
  email: HTMLElement,
  msg: HTMLElement,
  whatsapp: HTMLElement,
  subject: string,
  token: string | null
): void => {
  const inquiryPayload = {
    subject: `[${subject.charAt(0).toUpperCase()}${subject.slice(1)}] ${getNestedElValue(name, 'input')}`,
    body: `<strong>Name</strong>: ${getNestedElValue(name, 'input')}<br><br>
<strong>E-mail</strong>: ${getNestedElValue(email, 'input')}<br><br>
<strong>Whatsapp</strong>: ${getNestedElValue(whatsapp, 'input')}<br><br>
<strong>Message</strong>: ${getNestedElValue(msg, 'textarea')}`,
    token,
  };

  backendPost('contact-us',
    JSON.stringify(inquiryPayload),
    (_res: any) => {
      success(getTranslation('form-success'), Length.long);
      document.querySelector('#contact-us-modal')?.remove();
    },
    logError
  );
}

export const contactUsModal = (subject: string): HTMLElement => {
  const result = document.createElement('contact-us-modal');

  // @ts-ignore
  const currentName = window.store.currentUser ? window.store.currentUser.name : '';
  // @ts-ignore
  const currentEmail = window.store.currentUser ? window.store.currentUser.email : document.querySelector('#magic-link-email')?.textContent;

  const modalBody = document.createElement('modal-body');

  const form = document.createElement('form');
  form.id = 'contact-form';

  const nameField = contactField('input', 'text', 'name', true, currentName);
  const emailField = contactField('input', 'email', 'email', true, currentEmail);
  const messageField = contactField('textarea', 'text', 'message', true);
  const whatsappField = contactField('input', 'tel', 'whatsapp', false);
  const btn = document.createElement('button');
  btn.textContent = getTranslation('contact-submit');
  btn.className = 'primary-button';
  form.append(nameField, emailField, whatsappField, messageField, btn);

  modalBody.appendChild(form);

  const modal = percyModal(
    getTranslation('contact-page'),
    [],
    '',
    false,
    false,
    modalBody,
    '',
    '',
    () => result.remove()
  );
  modal.id = 'contact-us-modal';
  translateTexts(modal);

  document.querySelector('percy-body')?.appendChild(modal);
  modal.querySelector('modal-wrapper')?.setAttribute('style', 'max-width: 680px; width: 100%; overflow-y: auto;');

  const captcha = googleCaptcha();
  if (subject !== 'email-not-sent') {
  // @ts-ignore
  const admin = window.store?.selectedTeam?.admin || window.store.currentUser.email;
    backendGet(`credits-balance-for?admin=${admin}`,
      (res: any) => {
        const balance = res;

        if (balance <= 0) {
          form.insertBefore(captcha, btn);
        }
      },
      logError);
  } else {
    form.insertBefore(captcha, btn);
  }

  nameField.querySelector('input')?.select();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendInquiry(nameField, emailField, messageField, whatsappField, subject, captcha.getAttribute('token'));
  });

  return result;
}
