import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';

import * as Parse from 'parse';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  pages: any[];

  constructor(private platform: Platform) {
    this.initializeApp();
  }

  private setupPages() {
    this.pages = [
      {
        title: 'Accueil',
        url: '/dashboard',
        icon: 'home-outline',
      },

      {
        title: 'Formateurs',
        url: '/formateurs',
        icon: 'people',
      },

      {
        title: 'Etudiants',
        url: '/users',
        icon: 'people',
      },
      {
        title: 'Classes',
        url: '/classes',
        icon: 'albums-outline',
      },
      {
        title: 'Cours',
        url: '/cours',
        icon: 'reader-outline',
      },

      {
        title: 'Profil',
        url: '/profile',
        icon: 'person',
      },
    ];
  }

  private setupParse() {
    Parse.initialize(environment.appId, environment.appKey);
    Parse.serverURL = environment.serverURL;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.setupPages();
      this.setupParse();
    });
  }
}
