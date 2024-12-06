import { onAuthPasswordLogin, onGoogleSignIn, onMicrosoftSignIn } from './session';
import { loginButton } from './login-button';
import { getTranslation } from '../jux/language';
import { magicLinkModal } from './magic-link-modal';
import { basePage } from './base-page';

const authPasswordRow = (type: string, autoCompleteValue: AutoFill): HTMLElement => {
    const result = document.createElement(`${type}-row`);
    result.style.display = 'flex';

    const label = document.createElement('label');
    label.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    label.htmlFor = `input-${type}`;
    
    const input = document.createElement('input');
    input.id = `input-${type}`;
    input.type = type;
    input.autocomplete = autoCompleteValue;

    result.append(label, input);

    return result;
}

const authPasswordForm = (clientApp: HTMLElement, loginPage: HTMLElement, onUserLogin: any, backgroundImg: string): HTMLFormElement => {
    const result = document.createElement('form');

    const emailRow = authPasswordRow('email', 'username');
    const emailInput = emailRow.querySelector('input') as HTMLInputElement;

    const passwordRow = authPasswordRow('password', 'current-password');
    const passwordInput = passwordRow.querySelector('input') as HTMLInputElement;

    const togglePasswordDisplayBtn = document.createElement('button');
    togglePasswordDisplayBtn.type ='button';
    togglePasswordDisplayBtn.addEventListener('click', (_ev) => {
        const passwordType = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = passwordType;
    });
    passwordRow.appendChild(togglePasswordDisplayBtn);

    const handlePasswordLogin = () => onAuthPasswordLogin({ email: emailInput.value, password: passwordInput.value || null }, onUserLogin, onReturn, clientApp, backgroundImg);

    const onReturn = () => clientApp.appendChild(loginPage);
    const button = loginButton('Login', handlePasswordLogin);
    button.classList.add('auth-password');
    button.setAttribute('type', 'submit');

    const submitButton = document.createElement('button');
    submitButton.style.display = 'none';

    result.append(emailRow, passwordRow, button, submitButton);
    result.addEventListener('submit', (ev) => {
        ev.preventDefault();
        handlePasswordLogin();
    });

    return result;
}

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
    if (loginTypes.includes('auth-password')) {
        section.appendChild(authPasswordForm(clientApp, loginPage, onUserLogin, backgroundImg));
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
