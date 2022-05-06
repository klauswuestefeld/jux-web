import { loginButton } from '../components/login-button';
import { getTranslation } from '../i18n';

export const loginPage = (backgroundImg: string, text: string = getTranslation('sign-in-msg-general')): HTMLElement => {
    const result = document.createElement('login-page');

    const section = document.createElement('section');

    const salutation = document.createElement('sign-in-salutation');
    salutation.textContent = getTranslation('sign-in-salutation');

    const explanation = document.createElement('sign-in-explanation');
    explanation.textContent = getTranslation('sign-in-explanation');

    const msg = document.createElement('sign-in-msg');
    msg.textContent = text;

    const google = loginButton('googleLogo.png', () => {}, 'Google');
    const microsoft = loginButton('microsoft.svg', () => {}, 'Microsoft');
    const linkedin = loginButton('linkedin.svg', () => {}, 'LinkedIn');
    const email = loginButton('email.png', () => {}, 'Email', 33);

    result.style.backgroundImage = `url(${backgroundImg})`;

    section.append(salutation, explanation, msg, google, microsoft, linkedin, email);
    result.appendChild(section);

    return result;
}
