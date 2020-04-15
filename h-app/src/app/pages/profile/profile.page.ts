import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';

import { Base } from '../base/base';

import { ChangePasswordPage } from '../change-password/change-password.page';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage extends Base implements OnInit {
  user: any;

  constructor(injector: Injector, private authService: AuthService) {
    super(injector);
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  async onChangePassword() {
    try {
      const modal = await this.modalCtrl.create({ component: ChangePasswordPage, backdropDismiss: false });
      await modal.present();

      modal.onDidDismiss().then(async result => {
        if (result.data) {
          await this.presentToast('CHANAGE_PASSWORD_SUCCESS');
        }
      });
    } catch (error) {}
  }

  async onLogout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}
