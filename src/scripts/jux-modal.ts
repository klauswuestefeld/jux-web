import { getTranslation } from './jux/language';
import { juxDimmedBlack, juxMediumGreen, juxWhite } from './style-constants';

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

const close = (el: HTMLElement, onClose?: () => void): void => {
  el.remove();

  if (onClose) {
    onClose();
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
// interface JuxModalOptions {
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

const applyWrapperStyle = (wrapper: HTMLElement) => {
  wrapper.style.alignItems = 'center';
  wrapper.style.backgroundColor = juxWhite;
  wrapper.style.borderRadius = '.3125rem';
  wrapper.style.boxShadow = `0 0 1.33rem ${juxDimmedBlack}`;
  wrapper.style.boxSizing = 'content-box';
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.justifyContent = 'flex-start';
  wrapper.style.margin = '0';
  wrapper.style.maxHeight = '88%';
  wrapper.style.maxWidth = '40%';
  wrapper.style.minWidth = '20%';
  wrapper.style.padding = '2.8rem';
  wrapper.style.position = 'relative';
}

const applyModalStyle = (modal: HTMLElement) => {
  modal.style.alignItems = 'center';
  modal.style.backgroundColor = juxDimmedBlack;
  modal.style.display = 'flex';
  modal.style.height = '100vh';
  modal.style.justifyContent = 'center';
  modal.style.left = '0';
  modal.style.overflow = 'hidden';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.width = '100%';
  modal.style.zIndex = '9999';
}

const applyHeaderStyle = (header: HTMLElement) => {
  header.style.alignItems = 'center';
  header.style.color = juxMediumGreen;
  header.style.flexDirection = 'row';
  header.style.fontSize = '16px';
  header.style.fontWeight = '700';
  header.style.justifyContent = 'space-between';
  header.style.margin = '0';
  header.style.display = 'flex';
  header.style.position = 'relative';
  header.style.width = '100%';
}

const applyJuxModalContentStyle = (el: HTMLElement) => {
  el.style.display = 'flex';
  el.style.position = 'relative';
  el.style.width = '100%';
  el.style.flexFlow = 'column';
  el.style.marginTop = '1.33rem';
  el.style.fontSize = '14px';
  el.style.rowGap = '8px';
}

const applyFooterStyle = (footer: HTMLElement) => {
  footer.style.display = 'flex';
  footer.style.width = '100%';
  footer.style.justifyContent = 'flex-end';
  footer.style.alignItems = 'center';
  footer.style.gap = '0.75rem';
  footer.style.marginTop = '1.5rem';
  footer.style.paddingTop = '1rem';
}

const applyModalButtonStyle = (btn: HTMLButtonElement) => {
  btn.style.display = 'inline-flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';

  // size – smaller than main button
  btn.style.height = '36px';
  btn.style.minWidth = '88px';
  btn.style.padding = '0 16px';

  // visual similarity (but lighter)
  btn.style.background = 'rgb(255, 255, 255)';
  btn.style.border = '1px solid rgb(160, 160, 160)';
  btn.style.borderRadius = '4px';
  btn.style.boxShadow = '0 1px 2px rgba(0,0,0,0.15)';
  btn.style.color = 'rgb(68, 68, 68)';

  // typography
  btn.style.fontSize = '14px';
  btn.style.fontWeight = '500';
  btn.style.whiteSpace = 'nowrap';

  // interaction
  btn.style.cursor = 'pointer';
}

export const juxModal = (
  title: string,
  btns: string[] = ['ok', 'cancel'],
  content: string = '',
  persistent: boolean = false,
  busy: boolean = false,
  body?: HTMLElement | null,
  okTxt: string = getTranslation('alert-ok-btn-txt'),
  cancelTxt: string | null = getTranslation('alert-cancel-btn-txt'),
  onClose?: any,
  titleStyle?: string,
): HTMLElement => {
  const result = document.createElement('jux-modal');
  applyModalStyle(result);

  const wrapper = document.createElement('modal-wrapper');
  applyWrapperStyle(wrapper);

  // START close
  const closeBtn = document.createElement('button');
  if (!persistent) {
    closeBtn.className = 'close';
    closeBtn.setAttribute('aria-label', getTranslation('close'));
  }
  // END close

  // START header
  const header = document.createElement('modal-header');
  applyHeaderStyle(header);
  if (title) {
    if (titleStyle) {
      header.classList.add(titleStyle);
    }
    const h3 = document.createElement('h3');
    h3.textContent = title;
    h3.style.margin = '0';
    header.appendChild(h3);
  }
  // END header

  // START content
  const modalContent = document.createElement('jux-modal-content');
  applyJuxModalContentStyle(modalContent);

  if (content) {
    modalContent.innerHTML = content;
  } else if (body) {
    modalContent.appendChild(body);
  }
  // END content

  // START footer
  const footer = document.createElement('modal-footer');
  applyFooterStyle(footer);

  if (btns.includes('cancel')) {
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('secondary-button', 'modal-button', 'action', 'cancel-btn', 'cancel');
    applyModalButtonStyle(cancelBtn);

    const cancelText = document.createElement('button-text');
    cancelText.textContent = cancelTxt;

    const cancelSpinner = document.createElement('loading-spinner');
    if (!busy) cancelSpinner.style.display = 'none'; // ✅ minimal change

    cancelBtn.append(cancelText, cancelSpinner);
    footer.appendChild(cancelBtn);
  }

  if (btns.includes('ok')) {
    const okBtn = document.createElement('button');
    okBtn.classList.add('primary-button', 'modal-button', 'action', 'ok');
    applyModalButtonStyle(okBtn);

    const okText = document.createElement('button-text');
    okText.textContent = okTxt;

    const okSpinner = document.createElement('loading-spinner');
    if (!busy) okSpinner.style.display = 'none'; // ✅ minimal change

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
};

