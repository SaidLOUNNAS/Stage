import { Injectable } from '@angular/core';

import * as Parse from 'parse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  getCurrentUser(): any {
    return Parse.User.current();
  }

  login(email: string, password: string): Promise<any> {
    return Parse.User.logIn(email, password);
  }

  logout(): Promise<any> {
    return Parse.User.logOut();
  }

  recoverPassword(email: string): Promise<any> {
    return Parse.User.requestPasswordReset(email);
  }

  getRole(user: any): Promise<any> {
    const query = new Parse.Query(Parse.Role);
    query.equalTo('users', user);
    return query.first();
  }
}
