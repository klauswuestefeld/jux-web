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

export const chosenLanguage = getLocalStorageItem(OVERRIDE_KEY) || getBrowserLanguage();
export const reloadWithLanguageOverride = (lang: string) => {
  setLocalStorageItem(OVERRIDE_KEY, lang)
  location.reload();
};
// @ts-ignore
export const getTranslation = (k: string): string => translations[k] || k;

export const initLanguage = (translations_: any, defaultLanguage: string = 'en') => {
  translations = translations_[chosenLanguage] || translations_[defaultLanguage];
  document.title = getTranslation('title');
  document.documentElement.lang = translations_[chosenLanguage] ? chosenLanguage : defaultLanguage;
}
