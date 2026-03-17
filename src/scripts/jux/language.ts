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

export const formatTextToMarkdown = (container: HTMLElement, text: string) => {
  // Split the text on bold markers (**...**), <br>, markdown-style links [text](url),
  // and semantic color tags like {warning|text}.
  // The regex uses a capture group to include the delimiters in the results.
  const parts = text.split(/(\*\*.*?\*\*|<br>|\[.*?\]\(https?:\/\/.*?\)|\{[a-z0-9-]+\|.*?\})/gi);

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

    if (part.startsWith('{') && part.includes('|') && part.endsWith('}')) {
      const match = part.match(/\{([a-z0-9-]+)\|(.*?)\}/i);

      if (match) {
        const [, className, text] = match;
        const coloredText = document.createElement('span');
        coloredText.className = `${className.toLowerCase()}`;
        formatTextToMarkdown(coloredText, text);
        container.appendChild(coloredText);

        return;
      }
    }

    container.appendChild(document.createTextNode(part));
  });
};

export const createFormattedParagraph = (text: string): HTMLParagraphElement => {
  const paragraph = document.createElement('p');
  formatTextToMarkdown(paragraph, text);

  return paragraph;
};

export const applyFormattedTranslation = (element: HTMLElement, key: string) => {
  const wrapper = document.createElement('span');
  formatTextToMarkdown(wrapper, getTranslation(key));
  element.replaceChildren(...Array.from(wrapper.childNodes));
};

export const initLanguage = (translations_: any, defaultLanguage: string = 'en') => {
  chosenLanguage = getLocalStorageItem(OVERRIDE_KEY) || getBrowserLanguage();
  translations = translations_[chosenLanguage] || translations_[defaultLanguage];
  document.title = getTranslation('title');
  document.documentElement.lang = translations_[chosenLanguage] ? chosenLanguage : defaultLanguage;
}
