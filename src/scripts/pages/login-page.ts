import { loginButton } from '../components/login-button';
import { magicLinkModal } from '../components/magic-link-modal';
import { getTranslation } from '../i18n';
import { onGoogleSignIn, onLinkedinSignIn, onMicrosoftSignIn } from '../session';

const onMagicLinkRequest = (): void => {
    document.querySelector('percy-body')?.appendChild(magicLinkModal());
}

export const loginPage = (backgroundImg: string, text: string = getTranslation('sign-in-msg-general')): HTMLElement => {
    const result = document.createElement('login-page');

    const section = document.createElement('section');

    const salutation = document.createElement('sign-in-salutation');
    salutation.textContent = getTranslation('sign-in-salutation');

    const explanation = document.createElement('sign-in-explanation');
    explanation.textContent = getTranslation('sign-in-explanation');

    const msg = document.createElement('sign-in-msg');
    msg.textContent = text;

    const google = loginButton('googleLogo.png', onGoogleSignIn, 'Google');
    const microsoft = loginButton('microsoft.svg', onMicrosoftSignIn, 'Microsoft');
    const linkedin = loginButton('linkedin.svg', onLinkedinSignIn, 'LinkedIn');
    const email = loginButton('email.png', onMagicLinkRequest, 'Email', 33);

    result.style.backgroundImage = `url(${backgroundImg})`;

    section.append(salutation, explanation, msg, google, microsoft, linkedin, email);
    result.appendChild(section)

    return result;
}
