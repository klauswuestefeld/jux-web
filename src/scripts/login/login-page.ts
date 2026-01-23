import { loginButton } from './login-button';
import { backButton } from './back-button';
import { getTranslation } from '../jux/language';
import { magicLinkModal } from './magic-link-modal';
import { basePage } from './base-page';
import { juxModal } from '../jux-modal';

const authPasswordRow = (type: string, autoCompleteValue: AutoFill): { result: HTMLElement; input: HTMLInputElement } => {
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
    result.style.width = '100%';
    result.style.fontSize = '21px';
    input.style.width = '100%';
    input.style.height = '42px';
    input.style.fontSize = '18px';

    return { result, input };
}

const openForgotModal = () => {
    const modal = juxModal(
        getTranslation('forgot-modal'),
        ['cancel'],
        'Get in touch with the BELA administrator in your organization, to generate a new password for you.',
        false,
        false,
        null,
        '',
        'OK',
        null
    );
    modal.id = 'contact-us-modal';

    document.body.appendChild(modal);
}

const linkButton = (type: string): HTMLElement => {
    const loweredCasedType = type.toLowerCase();
    const result = document.createElement('login-button');
    result.tabIndex = 0;
    result.setAttribute('data-cy', `${loweredCasedType}-button`);
    result.style.fontSize = '18px';
    result.style.padding = '4px 16px';
    result.style.marginTop = '-8px';
    result.style.cursor = 'pointer';

    result.textContent = getTranslation(`${loweredCasedType}-label`);

    result.addEventListener('click', openForgotModal);

    return result;
};


const authPasswordForm = (
    clientApp: HTMLElement,
    loginPage: HTMLElement,
    onUserLogin: any,
    onLoginError: any,
    backgroundImg: string,
    handlers: {
        onAuthPasswordLogin: any;
        onGoogleSignIn: any;
        onMicrosoftSignIn: any;
        handleMagicLinkRequest: any;
    }
): HTMLFormElement => {
    const result = document.createElement('form');

    const { result: emailRow, input: emailInput } = authPasswordRow('email', 'username');
    const { result: passwordRow, input: passwordInput } = authPasswordRow('password', 'current-password');

    const togglePasswordDisplayBtn = document.createElement('button');
    togglePasswordDisplayBtn.type = 'button';
    togglePasswordDisplayBtn.addEventListener('click', (_ev) => {
        const passwordType = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = passwordType;
    });
    passwordRow.appendChild(togglePasswordDisplayBtn);

    const onReturn = () => clientApp.appendChild(loginPage);

    const handlePasswordLogin = () =>
        handlers.onAuthPasswordLogin(
            { email: emailInput.value, password: passwordInput.value || null },
            onUserLogin,
            onLoginError,
            onReturn,
            clientApp,
            backgroundImg
        );

    const button = loginButton('Login', handlePasswordLogin, false, true);
    button.classList.add('auth-password');
    button.setAttribute('type', 'submit');

    const forgotButton = linkButton('forgot');

    const submitButton = document.createElement('button');
    submitButton.style.display = 'none';
    result.style.marginTop = '24px';

    result.append(emailRow, passwordRow, button, forgotButton, submitButton);
    result.addEventListener('submit', (ev) => {
        ev.preventDefault();
        handlePasswordLogin();
    });

    return result;
}

const onEmailLoginRequest = (clientApp: HTMLElement, loginPage: HTMLElement, onUserLogin: any, backgroundImage: string, loginTypes: string[], handlers: { handleMagicLinkRequest: any; }): void => {
    const onReturn = () => clientApp.appendChild(loginPage);
    loginPage.appendChild(magicLinkModal(onUserLogin, onReturn, backgroundImage, loginPage, clientApp, loginTypes, handlers));
}

const appendLoginTypes = (
    loginPage: HTMLElement,
    btnsContainer: HTMLElement,
    clientApp: HTMLElement,
    onUserLogin: any,
    onLoginError: any,
    loginTypes: string[],
    backgroundImg: string,
    explanation: HTMLElement,
    handleSSOLogin: any,
    handlers: {
        onAuthPasswordLogin: any;
        onGoogleSignIn: any;
        onMicrosoftSignIn: any;
        handleMagicLinkRequest: any;
    }
) => {
    const upperLoginTypes = loginTypes.map(str => str.toUpperCase());
    const onlyAuth = upperLoginTypes.every(type => type === 'AUTH-PASSWORD')
    explanation.textContent = getTranslation('sign-in-explanation')

    if (upperLoginTypes.includes('AUTH-PASSWORD2') || onlyAuth) {
        btnsContainer.replaceChildren();
        btnsContainer.appendChild(authPasswordForm(clientApp, loginPage, onUserLogin, onLoginError, backgroundImg, handlers));
        upperLoginTypes.pop()

        explanation.textContent = getTranslation('sign-in-email')
        if (!onlyAuth) {
            btnsContainer.appendChild(backButton('Back', () => {
                btnsContainer.replaceChildren();

                appendLoginTypes(loginPage, btnsContainer, clientApp, onUserLogin, onLoginError, upperLoginTypes, backgroundImg, explanation, handleSSOLogin, handlers);
            }));
        }
        return
    }

    if (upperLoginTypes.includes('SSO')) {
        btnsContainer.appendChild(loginButton('SSO', () => {
            handleSSOLogin()
        }));
    }

    if (upperLoginTypes.includes('GOOGLE')) {
        btnsContainer.appendChild(loginButton('GOOGLE', () => handlers.onGoogleSignIn(onUserLogin)));
    }
    if (upperLoginTypes.includes('MICROSOFT')) {
        btnsContainer.appendChild(loginButton('MICROSOFT', () => handlers.onMicrosoftSignIn(onUserLogin)));
    }
    if (upperLoginTypes.includes('LINKEDIN')) {
        btnsContainer.appendChild(loginButton('LINKEDIN', () => console.log('login with Linkedin')));
    }
    if (upperLoginTypes.includes('EMAIL')) {
        btnsContainer.appendChild(loginButton('EMAIL', () => onEmailLoginRequest(clientApp, loginPage, onUserLogin, backgroundImg, upperLoginTypes, handlers)));
    }
    if (upperLoginTypes.includes('AUTH-PASSWORD')) {
        upperLoginTypes.push('AUTH-PASSWORD2')
        btnsContainer.appendChild(
            loginButton(
                'EMAIL-PASSWORD',
                () => appendLoginTypes(loginPage, btnsContainer, clientApp, onUserLogin, onLoginError, upperLoginTypes, backgroundImg, explanation, handleSSOLogin, handlers)
            )
        );
    }
    if (upperLoginTypes.includes('ANONYMOUS')) {
        btnsContainer.appendChild(loginButton('guest', () => onUserLogin('ANONYMOUS')));
    }
}

export const loginPage = (
    clientApp: HTMLElement,
    backgroundImg: string,
    onUserLogin: any,
    onLoginError: any,
    loginTypes: string[],
    handleSSOLogin: any,
    handlers: {
        onAuthPasswordLogin: any;
        onGoogleSignIn: any;
        onMicrosoftSignIn: any;
        handleMagicLinkRequest: any;
    }
): HTMLElement => {
    const content = [];

    const salutation = document.createElement('sign-in-salutation');
    salutation.textContent = getTranslation('sign-in-salutation');

    const explanation = document.createElement('sign-in-explanation');
    explanation.textContent = getTranslation('sign-in-explanation');

    const msg = document.createElement('sign-in-msg');
    msg.textContent = getTranslation('sign-in-msg-general');

    content.push(salutation, explanation, msg);
    const result = basePage('login-page', backgroundImg, content);
    const btnsContainer = result.querySelector('btns-container') as HTMLElement;

    appendLoginTypes(result, btnsContainer, clientApp, onUserLogin, onLoginError, loginTypes, backgroundImg, explanation, handleSSOLogin, handlers);

    return result;
}
