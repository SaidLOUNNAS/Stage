import { Injectable } from '@angular/core';

import * as Parse from 'parse';

@Injectable({
  providedIn: 'root',
})
export class EtudiantService {
  constructor() {}

  createEtudiant(params: any): Promise<any> {
    return Parse.Cloud.run('createEtudiant', params);
  }

  getEtudiants(params: any): Promise<any> {
    const query = new Parse.Query(Parse.User);

    query.equalTo('type', 'etudiant');

    return query.find();
  }

  getEtudiant(id: string): Promise<any> {
    const query = new Parse.Query(Parse.User);
    query.equalTo('objectId', id);
    return query.first();
  }

  getRole(user: any): Promise<any> {
    const query = new Parse.Query(Parse.Role);
    query.equalTo('users', user);
    return query.first();
  }

  deleteEtudiant(id: string): Promise<any> {
    return Parse.Cloud.run('deleteUser', { id });
  }
}
