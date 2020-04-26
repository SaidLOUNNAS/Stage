import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ModalController, ToastController } from '@ionic/angular';

import { CustomValidators } from '../../utils/CustomValidators';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  public form: FormGroup;

  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private modalCtrl: ModalController, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.setupForm();
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.isLoading = true;

        const user = this.authService.getCurrentUser();

        await this.authService.login(user.getUsername(), this.form.value.oldPassword);

        await user.save({ password: this.form.value.password });

        this.isLoading = false;

        this.modalCtrl.dismiss(true);
      } catch (error) {
        this.isLoading = false;

        if (error.code === 101) {
          const toast = await this.toastCtrl.create({ message: 'mot de passe incorrect', duration: 2000 });
          toast.present();
        } else if (error.code === 141) {
          const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
          toast.present();
        }
      }
    }
  }

  async onClose() {
    this.modalCtrl.dismiss();
  }

  private setupForm() {
    this.form = this.fb.group(
      {
        oldPassword: [null, Validators.compose([Validators.required])],
        password: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
        confirmPassword: [null],
      },
      {
        validator: CustomValidators.passwordMatchValidator,
      }
    );
  }
}
