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

  getEtudiants(params: any = {}): Promise<any> {
    const query = new Parse.Query('User');
    query.equalTo('type', 'etudiant');

    if (params.searchTerm) {
      query.contains('name', params.searchTerm);
    }
    return query.find();
  }
  getEtudiant(id: string): Promise<any> {
    const query = new Parse.Query('User');
    query.equalTo('objectId', id);
    return query.first();
  }

  getClasseByEtudiant(etudiant: any) {
    const query = new Parse.Query('Classe');
    query.equalTo('users', etudiant);
    return query.first();
  }

  deleteEtudiant(id: string): Promise<any> {
    return Parse.Cloud.run('deleteEtudiant', { id });
  }
}
