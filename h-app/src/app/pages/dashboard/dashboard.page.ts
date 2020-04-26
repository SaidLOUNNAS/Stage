import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { ModalController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  constructor(private authService: AuthService, public modalCtrl: ModalController, private menuCtrl: MenuController, private router: Router) {}

  async ngOnInit() {
    await this.menuCtrl.enable(true);
  }

  async onLogout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}
