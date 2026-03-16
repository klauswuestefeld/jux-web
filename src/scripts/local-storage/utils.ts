let prefix: string;

export const setLocalStoragePrefix = (s: string) => {
  if (prefix !== undefined) {
    throw 'prefix was already set to ' + prefix;
  }
  if (!s && s !== '') {
    throw 'prefix argument is ' + s + ', use empty string if you want no prefix.';
  }
  prefix = s
};

const getLocalStorageKey = (k: string) => {
  if (prefix === undefined)
    setLocalStoragePrefix('');

  return prefix.length === 0 ? k : `${prefix}_${k}`
};

// TODO: export this to the frontEnd and use it.
export const getLocalStorageItem = (k: string) => localStorage.getItem(getLocalStorageKey(k));
export const setLocalStorageItem = (k: string, v: string) => localStorage.setItem(getLocalStorageKey(k), v);
export const removeLocalStorageItem = (k: string) => localStorage.removeItem(getLocalStorageKey(k));
