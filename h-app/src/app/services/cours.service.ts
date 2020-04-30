import { Injectable } from '@angular/core';

import * as Parse from 'parse';

@Injectable({
  providedIn: 'root',
})
export class CourService {
  constructor() {}

  createCours(params: any): Promise<any> {
    const Cours = Parse.Object.extend('Cours');
    const cours = new Cours();
    cours.set('name', params.title);
    cours.set('classe', params.classe);
    cours.set('formateur', params.formateur);
    cours.set('date', params.date);

    cours.set('duree', params.duree);

    return cours.save();
  }

  getCours(params: any = {}): Promise<any> {
    const query = new Parse.Query('Cours');
    query.include('formateur');
    query.include('classe');

    return query.find();
  }

  getCour(id: string): Promise<any> {
    const query = new Parse.Query('Cours');
    query.include('formateur');
    query.include('classe');
    query.equalTo('objectId', id);
    return query.first();
  }

  async deleteCours(id: string): Promise<any> {
    const query = new Parse.Query('Cours');
    query.equalTo('objectId', id);
    const cours = await query.first();
    return cours.destroy();
  }
}
