export const extractTokenFromWindowLocation = (tokenParam: string, additionalParam = '') => {
  if (!tokenParam) return;

  let token = '';
  const tokenParameterName = `${tokenParam}=`;
  const search = window.location.search;
  const tokenParameterIndex = search.indexOf(tokenParameterName);

  if (tokenParameterIndex !== -1) {
    const tokenParameterNameLength = tokenParameterName.length;
    const leadingAmpersandIndex = search.indexOf('&', tokenParameterIndex);
    let searchWithoutToken = search;

    token = search.substring(tokenParameterIndex + tokenParameterNameLength);
    if (leadingAmpersandIndex !== -1) {
      token = search.substring(tokenParameterIndex + tokenParameterNameLength, leadingAmpersandIndex);
      searchWithoutToken = searchWithoutToken.slice(0, leadingAmpersandIndex) + searchWithoutToken.slice(leadingAmpersandIndex + 1);
    }

    searchWithoutToken = searchWithoutToken.replace(`${tokenParam}=` + token, '')
                                           .replace(additionalParam, '')
                                           .replace('\&cypress=true', '');
    if (searchWithoutToken === '?') {
      searchWithoutToken = '';
    }

    window.history.replaceState({}, document.title, window.location.pathname + searchWithoutToken);
  }

  return token;
}
