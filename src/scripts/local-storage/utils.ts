let urlPrefix: string;

export const setUrlPrefix = (s: string) => urlPrefix = s;

const getLocalStorageKey = (k: string) => urlPrefix ? `${urlPrefix}_${k}` : k;

export const getLocalStorageItem = (k: string) => localStorage.getItem(getLocalStorageKey(k));

export const setLocalStorageItem = (k: string, v: string) => localStorage.setItem(getLocalStorageKey(k), v);

export const removeLocalStorageItem = (k: string) => localStorage.removeItem(getLocalStorageKey(k));
