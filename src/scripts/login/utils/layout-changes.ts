export const enableSignInLayout = () => {
  document.body.style.cursor = 'progress';
  document.body.style.opacity = '0.5';
  document.body.style.pointerEvents = 'none';
}

export const disableSignInLayout = () => {
  document.body.style.cursor = 'default';
  document.body.style.opacity = '1';
  document.body.style.pointerEvents = 'auto';
}
