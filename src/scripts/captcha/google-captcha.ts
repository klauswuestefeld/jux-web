// TODO: find a way to import it
declare const grecaptcha: any;

export const googleCaptcha = (): HTMLElement => {
  const result = document.createElement('google-captcha');
  // @ts-ignore
  window.submitCaptcha = (token: string) => result.setAttribute('token', token);

  result.className = 'g-recaptcha';

  // @ts-ignore
  result.setAttribute('data-sitekey', process.env.GOOGLE_CAPTCHA_KEY!);
  result.setAttribute('data-callback', 'submitCaptcha');

  grecaptcha.render(result);

  return result;
}
