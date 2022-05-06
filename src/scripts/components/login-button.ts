import { THRESHOLD_WIDTH } from '../utils/constants';
import { getTranslation } from '../i18n';

export const loginButton = (src: string, fn: any, type: string, height: number = 40): HTMLElement => {
  const result = document.createElement('login-button');
  result.tabIndex = 0;
  result.setAttribute('data-cy', `${type.toLowerCase()}-button`);

  const icon = document.createElement('login-icon');

  const img = document.createElement('img');
  img.width = 40;
  img.height = height;
  img.className = 'ico';
  img.alt = '';
  img.src = `./images/${src}`;

  icon.appendChild(img);

  const label = document.createElement('login-label');
  label.textContent = window.innerWidth <= THRESHOLD_WIDTH ? type : getTranslation(`${type.toLowerCase()}-label`);

  result.onclick = () => fn();
  result.append(icon, label);

  return result;
}
