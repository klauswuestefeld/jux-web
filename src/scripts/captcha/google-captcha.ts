// TODO: find a better way to import external scripts
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
document.head.appendChild(script);

declare const grecaptcha: any;

export const googleCaptcha = (): HTMLElement => {
  const result = document.createElement('google-captcha');
  const notifyCaptchaChange = () => result.dispatchEvent(new Event('captcha-change'));

  const renderCaptcha = () => grecaptcha.ready(() => {
    grecaptcha.render(result, {
      sitekey: process.env.GOOGLE_CAPTCHA_KEY!,
      callback: (token: string) => {
        result.setAttribute('token', token);
        notifyCaptchaChange();
      },
      'expired-callback': () => {
        result.removeAttribute('token');
        notifyCaptchaChange();
      }
    });
    result.dispatchEvent(new Event('captcha-rendered'));
  });
  if (typeof grecaptcha === 'undefined') {
    script.addEventListener('load', renderCaptcha, { once: true });
  } else {
    renderCaptcha();
  }

  return result;
}
