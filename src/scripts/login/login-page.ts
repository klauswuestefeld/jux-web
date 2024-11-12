import { handleSSOLogin, onGoogleSignIn, onMicrosoftSignIn } from './session';
import { loginButton } from './login-button';
import { getTranslation } from '../jux/language';
import { magicLinkModal } from './magic-link-modal';
import { basePage } from './base-page';

const onEmailLoginRequest = (clientApp: HTMLElement, loginPage: HTMLElement, onUserLogin: any, backgroundImage: string, loginTypes: string[]): void => {
    const onReturn = () => clientApp.appendChild(loginPage);
    loginPage.appendChild(magicLinkModal(onUserLogin, onReturn, backgroundImage, loginPage, clientApp, loginTypes));
}

const appendLoginTypes = (loginPage: HTMLElement, section: HTMLElement, clientApp: HTMLElement, onUserLogin: any, loginTypes: string[], backgroundImg: string) => {
    if (loginTypes.includes('Google')) {
        section.appendChild(loginButton('Google', () => onGoogleSignIn(onUserLogin)));
    }
    if (loginTypes.includes('Microsoft')) {
        section.appendChild(loginButton('Microsoft', () => onMicrosoftSignIn(onUserLogin)));
    }
    if (loginTypes.includes('Linkedin')) {
        section.appendChild(loginButton('LinkedIn', () => console.log('login with Linkedin')));
    }
    if (loginTypes.includes('Email')) {
        section.appendChild(loginButton('Email', () => onEmailLoginRequest(clientApp, loginPage, onUserLogin, backgroundImg, loginTypes)));
    }
    if (loginTypes.includes('SSO')) {
        section.appendChild(loginButton('SSO', () => handleSSOLogin()));
    }
}

export const loginPage = (clientApp: HTMLElement, backgroundImg: string, onUserLogin: any, loginTypes: string[]): HTMLElement => {
    const content = [];

    const salutation = document.createElement('sign-in-salutation');
    salutation.textContent = getTranslation('sign-in-salutation');

    const explanation = document.createElement('sign-in-explanation');
    explanation.textContent = getTranslation('sign-in-explanation');

    const msg = document.createElement('sign-in-msg');
    msg.textContent = getTranslation('sign-in-msg-general');

    content.push(salutation, explanation, msg);
    const result = basePage('login-page', backgroundImg, content);
    const section = result.querySelector('section') as HTMLElement;

    appendLoginTypes(result, section, clientApp, onUserLogin, loginTypes, backgroundImg);

    return result;
}
