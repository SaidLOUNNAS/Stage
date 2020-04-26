import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';

import * as Parse from 'parse';

import { environment } from '../environments/environment';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  pages: any[];

  constructor(private platform: Platform, private authService: AuthService) {
    this.initializeApp();
  }

  private setupParse() {
    Parse.initialize(environment.appId, environment.appKey);
    Parse.serverURL = environment.serverURL;
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
        title: 'Profil',
        url: '/profile',
        icon: 'person',
      },
    ];
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.setupParse();
      this.setupPages();

      const user = this.authService.getCurrentUser();
      const userRole = await this.authService.getRole(user);

      if (userRole && userRole.getName() === 'etudiant') {
        this.pages = this.pages.filter((val) => val.title !== 'Formateurs');
      }
    });
  }
}
