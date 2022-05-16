export const extractTokenFromWindowLocation = (tokenParam: string, additionalParam = '') => {
  if (!tokenParam) {
    return;
  }

  let token = '';
  const tokenParameterName = `${tokenParam}=`;
  const tokenParameterIndex = window.location.search.indexOf(tokenParameterName);

  if (tokenParameterIndex !== -1) {
    const tokenParameterNameLength = tokenParameterName.length;
    const nextParameterIndex = window.location.search.indexOf('&', tokenParameterIndex);

    token = (nextParameterIndex === -1) ?
      window.location.search.substring(tokenParameterIndex + tokenParameterNameLength) :
      window.location.search.substring(tokenParameterIndex + tokenParameterNameLength, nextParameterIndex);

    let searchWithoutToken = window.location.search.replace(`${tokenParam}=` + token, '').replace(additionalParam, '').replace('\&cypress=true', '');
    if (searchWithoutToken === '?') {
      searchWithoutToken = '';
    }

    window.history.replaceState({}, document.title, window.location.pathname + searchWithoutToken);
  }

  return token;
}
