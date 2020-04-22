import { Injectable } from '@angular/core';

import * as Parse from 'parse';

@Injectable({
  providedIn: 'root',
})
export class EtudiantService {
  constructor() {}

  async createEtudiant(params: any): Promise<any> {
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

  deleteEtudiant(id: string): Promise<any> {
    return Parse.Cloud.run('deleteUser', { id });
  }

  getClasseByEtudiant(etudiant: any) {
    const query = new Parse.Query('Classe');
    query.equalTo('users', etudiant);
    return query.first();
  }
}
