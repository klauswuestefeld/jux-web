import { loginPage } from '../pages/login-page';
import { magicLinkRequestedPage } from '../pages/magic-link-requested-page';

export enum Page {
  ACCOUNT,
  TEAMS,
  APPRAISALS,
  CANT_APPRAISE,
  CLOSED_ROUND,
  DISCONNECTED,
  LOGIN,
  LOGOUT,
  MAGIC_LOGIN,
  NO_RESULTS,
  NOT_ADMIN,
  RESULTS,
  RESULTS_DATA,
  SUPER_ADMIN,
  TEAMLESS_ADMIN,
}

// TODO: Desduplicar e simplificar navegação
export const displayPage = async (page: Page) => {
  const body = document.querySelector('percy-body');

  if (!body) {
    return;
  }

  body.innerHTML = '';

  document.querySelector('percy-header')?.remove();
  document.querySelector('percy-footer')?.remove();

  switch (page) {
    case Page.LOGIN:
      body.appendChild(loginPage(''));

      break;

    case Page.MAGIC_LOGIN:
      body.appendChild(magicLinkRequestedPage(''));

      break;

    default:
      break;
  }
}
