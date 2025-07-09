export class SelectedTeam {
  public admin?: string;
}

export class CurrentUser {
  public token: string;
  public admin?: boolean;
  public email: string;
  public name?: string;

  constructor(token: string, admin: boolean, email: string) {
    this.token = token;
    this.admin = admin;
    this.email = email;
  }
}

export class JuxWebGlobal {
  private _currentUser?: CurrentUser;
  private _backendToken?: string;
  public selectedTeam?: SelectedTeam;
  public fetchUserBackendUrl?: any;
  public magicLinkAuthEndpoint?: string;
  public magicLinkRequestEndpoint?: string;

  public setCurrentUser(newUser: CurrentUser) {
    this._currentUser = newUser;
  }

  public getCurrentUser(): CurrentUser | undefined {
    return this._currentUser;
  }

  public setBackendToken(token: string) {
    this._backendToken = token;
  }

  public getBackendToken(): string | undefined {
    return this._backendToken;
  }
}
