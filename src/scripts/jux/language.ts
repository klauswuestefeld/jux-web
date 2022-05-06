declare const navigator: any;

export const getBrowserLanguage = () => {
  const result = (navigator.languages && navigator.languages.length)
    ? navigator.languages[0]
    : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';

  return result.substring(0, 2);
}

export const replaceTextNodes = (node: HTMLElement, translations: any) => {
  Array.from(node.children).forEach((child) => {
    const key = child.id ? child.id : child.tagName?.toLowerCase();

    if (translations[key]) {
      child.innerHTML = translations[key];
    }

    replaceTextNodes(child as HTMLElement, translations);
  });
}
