import { THRESHOLD_WIDTH } from './utils/constants';
import { getTranslation } from '../jux/language';

const icons = {
  back: '<?xml version="1.0" encoding="UTF-8"?><svg id="b" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.87 44.42"><g id="c"><polyline points="21.77 1.02 2.05 22.21 21.77 43.4" style="fill:none; stroke:#000; stroke-miterlimit:10; stroke-width:3px;"/></g></svg>',
}

const applyComponentStyle = (component: HTMLElement) => {
  component.style.alignSelf = 'flex-start';
  component.style.alignItems = 'center';
  component.style.color = '#444';
  component.style.display = 'flex';
  component.style.gap = '8px';
  component.style.position = 'relative';
  component.style.height = '42px';
  component.style.marginTop = '32px';
  component.style.whiteSpace = 'nowrap';
  component.style.boxSizing = 'content-box';
}

const applyLabelStyle = (label: HTMLElement) => {
  label.style.display = 'inline-block';
  label.style.fontSize = '21px';
  label.style.fontWeight = '500';
  label.style.gridColumnStart = '3';
  label.style.textAlign = 'center';
}

export const backButton = (type: string, fn: any): HTMLElement => {
  const loweredCasedType = type.toLowerCase();
  const result = document.createElement('back-button');
  applyComponentStyle(result);
  result.tabIndex = 0;
  result.setAttribute('data-cy', `${loweredCasedType}-button`);
  
  // @ts-ignore
  const iconHTML = icons[loweredCasedType];
  
  if (iconHTML) {
    const icon = document.createElement('login-icon');
    icon.style.gridColumnStart = '2';
  
    icon.style.width = '28px';
    icon.style.padding = '6px';
    icon.style.marginLeft = '4px';
    icon.style.boxSizing = 'border-box';
    icon.className = 'ico';

    icon.innerHTML = iconHTML;
    result.appendChild(icon);
  }

  const label = document.createElement('login-label');
  console.log(window.innerWidth <= THRESHOLD_WIDTH, type);
  
  label.textContent = window.innerWidth <= THRESHOLD_WIDTH ? type : getTranslation(`${loweredCasedType}-label`);
  applyLabelStyle(label);
  result.appendChild(label);
  
  result.addEventListener('click', fn);
  result.addEventListener('mouseenter', (_ev) => {
    result.style.cursor = 'pointer';
    result.style.marginLeft = '-4px';
  });
  result.addEventListener('mouseleave', (_ev) => {
    result.style.cursor = 'auto';
    result.style.marginLeft = '0';
  });

  return result;
}
