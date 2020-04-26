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
    const query = new Parse.Query('User');

    query.equalTo('type', 'formateur');

    if (params.searchTerm) {
      query.contains('name', params.searchTerm);
    }
    return query.find();
  }

  getFormateur(id: string): Promise<any> {
    const query = new Parse.Query('user');
    query.equalTo('objectId', id);
    return query.first();
  }

  deleteFormateur(id: string): Promise<any> {
    return Parse.Cloud.run('deleteFormateur', { id });
  }
}
