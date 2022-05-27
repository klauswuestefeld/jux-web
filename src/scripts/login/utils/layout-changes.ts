export const enableSignInLayout = () => {
  document.documentElement.style.cursor = 'progress';
  document.body.style.opacity = '0.5';
  document.body.style.pointerEvents = 'none';
}

export const disableSignInLayout = () => {
  document.documentElement.style.cursor = 'default';
  document.body.style.opacity = '1';
  document.body.style.pointerEvents = 'auto';
}
