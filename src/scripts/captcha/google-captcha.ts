// TODO: find a better way to import external scripts
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://www.google.com/recaptcha/api.js';
document.head.appendChild(script);

declare const grecaptcha: any;

export const googleCaptcha = (): HTMLElement => {
  const result = document.createElement('google-captcha');
  window.submitCaptcha = (token: string) => result.setAttribute('token', token);

  result.className = 'g-recaptcha';

  // @ts-ignore
  result.setAttribute('data-sitekey', process.env.GOOGLE_CAPTCHA_KEY!);
  result.setAttribute('data-callback', 'submitCaptcha');

  grecaptcha.render(result);

  return result;
}
