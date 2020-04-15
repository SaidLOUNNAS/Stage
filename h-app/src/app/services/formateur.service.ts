import { Injectable } from '@angular/core';

import * as Parse from 'parse';

@Injectable({
  providedIn: 'root',
})
export class FormateurService {
  constructor() {}

  createFormateur(params: any): Promise<any> {
    return Parse.Cloud.run('createFormateur', params);
  }

  getFormateurs(params: any): Promise<any> {
    const query = new Parse.Query(Parse.User);

    query.equalTo('type', 'formateur');

    return query.find();
  }

  getFormateur(id: string): Promise<any> {
    const query = new Parse.Query(Parse.User);
    query.equalTo('objectId', id);
    return query.first();
  }

  getRole(user: any): Promise<any> {
    const query = new Parse.Query(Parse.Role);
    query.equalTo('users', user);
    return query.first();
  }

  deleteFormateur(id: string): Promise<any> {
    return Parse.Cloud.run('deleteUser', { id });
  }
}
