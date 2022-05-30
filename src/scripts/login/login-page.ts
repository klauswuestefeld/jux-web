import { onGoogleSignIn, onMicrosoftSignIn } from './session';
import { loginButton } from './login-button';
import { getTranslation } from '../jux/language';
import { magicLinkModal } from './magic-link-modal';

const applyContainerStyles = (container: HTMLElement) => {
    container.style.backgroundColor = '#ffffffdd';
    container.style.borderRadius = '16px';
    container.style.inset = '50% 50% 50% 0';
    container.style.position = 'relative';
    container.style.transform = 'translateY(-50%)';
    container.style.width = '620px';
    container.style.alignItems = 'center';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.fontSize = '16px';
    container.style.height = '100%';
    container.style.justifyContent = 'center';
    container.style.margin = '0 auto';
    container.style.paddingTop = '0';
}

const applyPageStyles = (page: HTMLElement) => {
    page.style.backgroundPosition = '50%';
    page.style.backgroundSize = 'cover';
    page.style.display = 'block';
    page.style.height = '100%';
}

const onEmailLoginRequest = (loginPage: HTMLElement, onUserLogin: any): void => {
    const onReturn = () => document.appendChild(loginPage);
    loginPage.appendChild(magicLinkModal(onUserLogin, onReturn));
}

export const loginPage = (backgroundImg: string, onUserLogin: any): HTMLElement => {
    const result = document.createElement('login-page');
    applyPageStyles(result);

    const section = document.createElement('section');
    applyContainerStyles(section);

    const salutation = document.createElement('sign-in-salutation');
    salutation.textContent = getTranslation('sign-in-salutation');

    const explanation = document.createElement('sign-in-explanation');
    explanation.textContent = getTranslation('sign-in-explanation');

    const msg = document.createElement('sign-in-msg');
    msg.textContent = getTranslation('sign-in-msg-general');

    const google = loginButton('Google', () => onGoogleSignIn(onUserLogin));
    const microsoft = loginButton('Microsoft', () => onMicrosoftSignIn(onUserLogin));
    const linkedin = loginButton('LinkedIn', () => console.log('login with Linkedin'));
    const email = loginButton('Email', () => onEmailLoginRequest(result, onUserLogin));

    result.style.backgroundImage = `url(${backgroundImg})`;

    section.append(salutation, explanation, msg, google, microsoft, linkedin, email);
    result.appendChild(section);

    return result;
}
