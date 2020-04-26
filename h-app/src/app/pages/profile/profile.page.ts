import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Router } from '@angular/router';

import { ModalController, ToastController } from '@ionic/angular';

import { ChangePasswordPage } from '../change-password/change-password.page';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {
  user: any;

  constructor(private authService: AuthService, private modalCtrl: ModalController, private toastCtrl: ToastController, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  async onChangePassword() {
    try {
      const modal = await this.modalCtrl.create({ component: ChangePasswordPage, backdropDismiss: false });
      await modal.present();

      modal.onDidDismiss().then(async (result) => {
        if (result.data) {
          const toast = await this.toastCtrl.create({ message: 'Changement de mot de passe réussi', duration: 2000 });
          toast.present();
        }
      });
    } catch (error) {
      const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
      toast.present();
    }
  }

  async onLogout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}
