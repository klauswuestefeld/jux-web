import { backendGet, backendPost } from '../api-client';
import { googleCaptcha } from '../captcha/google-captcha';
import { getTranslation, translateTexts } from '../i18n';
import { juxModal } from '../jux-modal';
import { contactField } from './contact-field';

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

  backendPost(
    'contact-us',
    JSON.stringify(inquiryPayload),
    (_res) => {
      // success(getTranslation('form-success'), Length.long);
      document.querySelector('#contact-us-modal')?.remove();
    },
    () => { } // TODO: change it to be an error handling fn provided by the client
  );

  // checkMixpanel(() => mixpanel.track("Sent Contact Inquiry", {}));
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

  const modal = juxModal(
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

  document.body.appendChild(modal);
  modal.querySelector('modal-wrapper')?.setAttribute('style', 'max-width: 680px; width: 100%; overflow-y: auto;');

  const captcha = googleCaptcha();
  if (subject !== 'email-not-sent') {
    // @ts-ignore
    const admin = window.store?.selectedTeam?.admin || window.store.currentUser.email;
    backendGet(
      `credits-balance-for?admin=${admin}`,
      (res) => {
        const balance = res;

        if (balance <= 0) {
          form.insertBefore(captcha, btn);
        }
      },
      () => { } // TODO: change it to be an error handling fn provided by the client
    );
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
