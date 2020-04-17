import { Injectable } from '@angular/core';

import * as Parse from 'parse';

@Injectable({
  providedIn: 'root',
})
export class ClasseService {
  constructor() {}

  createClasse(params: any): Promise<any> {
    return Parse.Cloud.run('createClasse', params);
  }

  getClasses(params: any): Promise<any> {
    const query = new Parse.Query(Parse.User);

    query.equalTo('type', 'Classe');

    return query.find();
  }

  getClasse(id: string): Promise<any> {
    const query = new Parse.Query(Parse.User);
    query.equalTo('objectId', id);
    return query.first();
  }

  getRole(user: any): Promise<any> {
    const query = new Parse.Query(Parse.Role);
    query.equalTo('users', user);
    return query.first();
  }

  deleteClasse(id: string): Promise<any> {
    return Parse.Cloud.run('deleteUser', { id });
  }
}
