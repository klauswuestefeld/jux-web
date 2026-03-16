import { getLocalStorageItem, setLocalStorageItem } from '../local-storage/utils';

declare const navigator: any;

const getBrowserLanguage = () => {
  const result = (navigator.languages && navigator.languages.length)
    ? navigator.languages[0]
    : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';

  return result.substring(0, 2);
}

const OVERRIDE_KEY = 'jux.language.override';
let translations = {};

export let chosenLanguage = getBrowserLanguage();
export const reloadWithLanguageOverride = (lang: string) => {
  setLocalStorageItem(OVERRIDE_KEY, lang)
  location.reload();
};
// @ts-ignore
export const getTranslation = (k: string): string => translations[k] || k;

const appendFormattedNodes = (container: HTMLElement, text: string) => {
  // Split the text on bold markers (**...**), <br>, and markdown-style links [text](url).
  // The regex uses a capture group to include the delimiters in the results.
  const parts = text.split(/(\*\*.*?\*\*|<br>|\[.*?\]\(https?:\/\/.*?\))/g);

  parts.forEach(part => {
    if (!part) return;

    if (part === '<br>') {
      container.appendChild(document.createElement('br'));
      return;
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      const bold = document.createElement('b');
      bold.textContent = part.slice(2, -2);
      container.appendChild(bold);
      return;
    }

    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/\[(.*?)\]\((https?:\/\/.*?)\)/);

      if (match) {
        const [, label, href] = match;
        const link = document.createElement('a');
        link.href = href;
        link.textContent = label;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        container.appendChild(link);

        return;
      }
    }

    container.appendChild(document.createTextNode(part));
  });
};

export const applyFormattedTranslation = (element: HTMLElement, key: string) => {
  const wrapper = document.createElement('span');
  appendFormattedNodes(wrapper, getTranslation(key));
  element.replaceChildren(...Array.from(wrapper.childNodes));
};

export const initLanguage = (translations_: any, defaultLanguage: string = 'en') => {
  chosenLanguage = getLocalStorageItem(OVERRIDE_KEY) || getBrowserLanguage();
  translations = translations_[chosenLanguage] || translations_[defaultLanguage];
  document.title = getTranslation('title');
  document.documentElement.lang = translations_[chosenLanguage] ? chosenLanguage : defaultLanguage;
}
