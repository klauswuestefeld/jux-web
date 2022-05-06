export const percySpacer = ({ vertical = -1, horizontal = -1 }) => {
  const result = document.createElement('percy-spacer');

  if (vertical > -1) {
      result.style.height = `${vertical}px`;
  }

  if (horizontal > -1) {
      result.style.width = `${horizontal}px`;
  }

  return result;
}
