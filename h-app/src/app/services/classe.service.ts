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

  getClasses(params: any = {}): Promise<any> {
    const query = new Parse.Query('Classe');

    if (params.searchTerm) {
      query.contains('name', params.searchTerm);
    }
    return query.find();
  }

  getClasse(id: string): Promise<any> {
    const query = new Parse.Query('Classe');
    query.equalTo('objectId', id);
    return query.first();
  }

  deleteClasse(id: string): Promise<any> {
    return Parse.Cloud.run('deleteClasse', { id });
  }
}
