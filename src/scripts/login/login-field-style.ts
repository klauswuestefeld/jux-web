const loginFieldClass = 'jux-login-field';

const addLoginFieldStyles = (): void => {
  if (document.querySelector(`style[data-${loginFieldClass}]`)) return;

  const style = document.createElement('style');
  style.setAttribute(`data-${loginFieldClass}`, '');
  style.textContent = `
    .${loginFieldClass}:hover {
      outline: 1px solid #999 !important;
      outline-offset: -1px;
    }
    .${loginFieldClass}:focus {
      outline: 2px solid #3943B7 !important;
      outline-offset: -2px;
    }
  `;
  document.head.appendChild(style);
};

export const applyLoginFieldStyle = (field: HTMLInputElement | HTMLTextAreaElement): void => {
  addLoginFieldStyles();
  field.classList.add(loginFieldClass);
  field.style.backgroundColor = '#fff';
  field.style.border = '1px solid #ccc';
  field.style.borderRadius = '8px';
  field.style.boxShadow = 'inset 0 2px 3px #28282822';
  field.style.boxSizing = 'border-box';
  field.style.color = '#444';
  field.style.cursor = 'text';
  field.style.fontFamily = 'Helvetica, Arial, sans-serif';
  field.style.fontSize = '16px';
  field.style.height = '40px';
  field.style.lineHeight = '38px';
  field.style.margin = '0';
  field.style.outline = 'none';
  field.style.overflow = 'hidden';
  field.style.padding = '0 12px';
  field.style.width = '100%';
};
