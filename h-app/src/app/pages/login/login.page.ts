import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MenuController, ToastController, AlertController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage implements OnInit {
  form: FormGroup;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    this.setupForm();
    await this.menuCtrl.enable(false);
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.isLoading = true;
        await this.authService.login(this.form.value.email.toLowerCase(), this.form.value.password);
        this.isLoading = false;
        await this.router.navigateByUrl('/dashboard');
      } catch (error) {
        this.isLoading = false;
        if (error.code === 101) {
          const toast = await this.toastCtrl.create({ message: "Les informations d'indentification invalides", duration: 2000 });
          toast.present();
        } else if (error.code === 205) {
          const toast = await this.toastCtrl.create({ message: "mail n'est pas verifier", duration: 2000 });
          toast.present();
        } else if (error.code === 141) {
          const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
          toast.present();
        }
      }
    }
  }

  async onResetPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Réinitialiser le mot de passe',
      cssClass: 'Réinitialiser le mot de passe',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email',
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'Annuler',
        },
        {
          text: 'Ok',
          role: 'ok',
        },
      ],
    });

    await alert.present();

    alert.onDidDismiss().then(async (result) => {
      if (result.role === 'ok') {
        try {
          await this.authService.recoverPassword(result.data.values.email.toLowerCase());

          const toast = await this.toastCtrl.create({ message: 'Emil de validation envoyé', duration: 2000 });
          toast.present();
        } catch (error) {
          if (error.code === 205) {
            const toast = await this.toastCtrl.create({ message: 'Email non trouvé', duration: 2000 });
            toast.present();
          } else if (error.code === 141) {
            const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
            toast.present();
          }
        }
      }
    });
  }

  private setupForm() {
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
    });
  }
}
