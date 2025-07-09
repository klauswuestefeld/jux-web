import { getTranslation } from '../jux/language';

export const contactField = (
  tag: string = 'input',
  elType: string,
  elName: string,
  required: boolean = true,
  value?: string | null
): HTMLElement => {
  const result = document.createElement('contact-field');
  const elId = 'contact-' + elName;

  const label = document.createElement('label');
  label.textContent = getTranslation(elId + '-label');
  label.htmlFor = elId;

  const el = document.createElement(tag);
  el.id = elId;
  el.setAttribute('name', elName);
  el.setAttribute('placeholder', getTranslation(elId + '-placeholder'));
  if (tag === 'input') {
    el.setAttribute('type', elType);
  }
  if (required) {
    el.setAttribute('required', 'true');
  }
  if (value) {
    el.setAttribute('value', value);
  }
  result.append(label, el);

  return result;
}
