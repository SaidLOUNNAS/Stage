import { Injectable } from '@angular/core';

import * as Parse from 'parse';

@Injectable({
  providedIn: 'root',
})
export class CourService {
  constructor() {}

  createCour(params: any): Promise<any> {
    return Parse.Cloud.run('createCour', params);
  }

  getCours(params: any): Promise<any> {
    const query = new Parse.Query(Parse.User);

    query.equalTo('type', 'Cour');

    return query.find();
  }

  getCour(id: string): Promise<any> {
    const query = new Parse.Query(Parse.User);
    query.equalTo('objectId', id);
    return query.first();
  }

  getRole(user: any): Promise<any> {
    const query = new Parse.Query(Parse.Role);
    query.equalTo('users', user);
    return query.first();
  }

  deleteCour(id: string): Promise<any> {
    return Parse.Cloud.run('deleteUser', { id });
  }
}
