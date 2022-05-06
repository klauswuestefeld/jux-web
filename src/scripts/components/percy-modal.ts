import { getTranslation } from '../i18n';
import { percySpacer } from './percy-spacer';

export const toggleBusyStatus = (className: string = '.ok'): void => {
  const btn = document.querySelector(`percy-modal ${className}`);

  if (btn?.hasAttribute('disabled')) {
    btn.removeAttribute('disabled');

    return;
  }

  btn?.setAttribute('disabled', 'true');
}

const close = (el: HTMLElement, onClose?: () => void): void => {
  el.remove();

  if (onClose) {
    onClose();
  }
}

const onKeyDown = (
  ev: KeyboardEvent,
  el: HTMLElement,
  persitent: boolean,
  onClose: () => void
): any => {
  if (ev.key === 'Escape') {
    if (persitent) {
      return;
    }

    close(el, onClose);
  } else if (ev.key === 'Enter') {
    if ((ev.target as HTMLElement).id === 'members-textarea') {
      return;
    }

    el.dispatchEvent(new CustomEvent('ok'));
  }
}

const attachEventHandlers = (
  el: HTMLElement,
  persitent: boolean,
  onClose?: () => void
): void => {
  const cancelButton = el.querySelector('.cancel');
  cancelButton?.addEventListener('click', (_e) => {
    el.dispatchEvent(new CustomEvent('cancel'));

    if (el.hasAttribute('dont-remove')) {
      return;
    }

    close(el, onClose);
  });

  const closeButton = el.querySelector('.close');

  if (closeButton) {
    closeButton.addEventListener('click', (_e) => {
      close(el, onClose);
    });
  }

  const okButton = el.querySelector('.ok');
  okButton?.addEventListener('click', (_e) => {
    el.dispatchEvent(new CustomEvent('ok'));
  });

  el.removeEventListener('keydown', (ev) => onKeyDown(ev, el, persitent, () => onClose));
  el.addEventListener('keydown', (ev) => onKeyDown(ev, el, persitent, () => onClose));

  el?.addEventListener('click', (e) => {
    if (e.target === el) {
      if (persitent) {
        return;
      }

      close(el, onClose);
    }
  });
}

// TODO: Mudar construtor para usar essa interface
// interface PercyModalOptions {
//   title?: string,
//   btns?: string[],
//   content?: string,
//   isPersistent?: boolean,
//   isBusy?: boolean,
//   body?: HTMLElement,
//   okTxt?: string,
//   cancelTxt?: string,
//   onClose?: any,
//   titleStyle?: string,
// }

export const percyModal = (
  title: string,
  btns: string[] = ['ok', 'cancel'],
  content: string = '',
  persistent: boolean = false,
  _busy: boolean = false,
  body?: HTMLElement | null,
  okTxt: string = getTranslation('alert-ok-btn-txt'),
  cancelTxt: string | null = getTranslation('alert-cancel-btn-txt'),
  onClose?: any,
  titleStyle?: string,
): HTMLElement => {
  const result = document.createElement('percy-modal');
  const wrapper = document.createElement('modal-wrapper');

  // START close
  const closeBtn = document.createElement('button');
  if (!persistent) {
    closeBtn.className = 'close';
    closeBtn.setAttribute('aria-label', getTranslation('close'));
  }
  // END close

  // START header
  const header = document.createElement('modal-header');
  if (title) {
    if (titleStyle) {
      header.classList.add(titleStyle);
    }
    const h3 = document.createElement('h3');
    h3.textContent = title;
    header.appendChild(h3);
  } else {
    header.appendChild(percySpacer({ vertical: 21.28 }));
  }
  // END header

  // START content
  const modalContent = document.createElement('percy-modal-content');

  if (content) {
    modalContent.innerHTML = content;
  } else if (body) {
    modalContent.appendChild(body);
  }
  // END content

  // START footer
  const footer = document.createElement('modal-footer');

  if (btns.includes('cancel')) {
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('secondary-button', 'modal-button', 'action', 'cancel-btn', 'cancel');
    const cancelText = document.createElement('button-text');
    cancelText.textContent = cancelTxt;
    const cancelSpinner = document.createElement('percy-spinner');

    cancelBtn.append(cancelText, cancelSpinner);
    footer.appendChild(cancelBtn);
  }

  if (btns.includes('ok')) {
    const okBtn = document.createElement('button');
    okBtn.classList.add('primary-button', 'modal-button', 'action', 'ok');
    const okText = document.createElement('button-text');
    okText.textContent = okTxt;
    const okSpinner = document.createElement('percy-spinner');

    okBtn.append(okText, okSpinner);
    footer.appendChild(okBtn);
  }
  // END footer

  if (footer.hasChildNodes()) {
    wrapper.append(closeBtn, header, modalContent, footer);
  } else {
    wrapper.append(closeBtn, header, modalContent);
  }

  result.appendChild(wrapper);

  if (!persistent) {
    (result.querySelector('.close') as HTMLButtonElement).focus();
  } else {
    if (btns.includes('ok')) {
      (result.querySelector('.ok') as HTMLButtonElement).focus();
    }
  }

  attachEventHandlers(result, persistent, onClose);
  return result;
}
