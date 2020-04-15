import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Base } from '../base/base';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage extends Base implements OnInit {
  form: FormGroup;

  constructor(injector: Injector, private fb: FormBuilder, private authService: AuthService) {
    super(injector);
  }

  async ngOnInit() {
    this.setupForm();
    await this.menuCtrl.enable(false);
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.isLoadingBSubject$.next(true);
        await this.authService.login(this.form.value.email.toLowerCase(), this.form.value.password);
        this.isLoadingBSubject$.next(false);
        await this.router.navigateByUrl('/dashboard');
      } catch (error) {
        this.isLoadingBSubject$.next(false);
        if (error.code === 101) {
          await this.presentToast('INVALID_CREDENTIALS');
        } else if (error.code === 205) {
          await this.presentToast('EMAIL_NOT_VERIFIED');
        } else if (error.code === 141) {
          await this.presentToast(error.message);
        } else {
          await this.presentToast('NETWORK_ERROR');
        }
      }
    }
  }

  async onResetPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Reset password',
      cssClass: 'reset_password',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          role: 'ok'
        }
      ]
    });

    await alert.present();

    alert.onDidDismiss().then(async result => {
      if (result.role === 'ok') {
        try {
          await this.authService.recoverPassword(result.data.values.email.toLowerCase());
          await this.presentToast('VALIDATION_EMAIL_SENT');
        } catch (error) {
          if (error.code === 205) {
            await this.presentToast('EMAIL_NOT_FOUND');
          } else if (error.code === 141) {
            await this.presentToast(error.message);
          } else {
            await this.presentToast('NETWORK_ERROR');
          }
        }
      }
    });
  }

  private setupForm() {
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }
}
