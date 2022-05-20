declare const navigator: any;

const getBrowserLanguage = () => {
  const result = (navigator.languages && navigator.languages.length)
    ? navigator.languages[0]
    : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';

  return result.substring(0, 2);
}

const OVERRIDE_KEY = 'jux.language.override';
let translations = {};

export const chosenLanguage = localStorage.getItem(OVERRIDE_KEY) || getBrowserLanguage();
export const reloadWithLanguageOverride = (lang: string) => {
  localStorage.setItem(OVERRIDE_KEY, lang)
  location.reload();
};
// @ts-ignore
export const getTranslation = (k: string): string => translations[k];

export const initLanguage = (translations_: any) => {
  translations = translations_[chosenLanguage];
  document.title = getTranslation('title');
  document.documentElement.lang = chosenLanguage;
}
