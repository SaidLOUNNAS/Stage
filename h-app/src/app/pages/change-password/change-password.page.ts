import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { CustomValidators } from '../../utils/CustomValidators';

import { Base } from '../base/base';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordPage extends Base implements OnInit {
  public form: FormGroup;

  constructor(injector: Injector, private fb: FormBuilder, private authService: AuthService) {
    super(injector);
  }

  ngOnInit() {
    this.setupForm();
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.isLoadingBSubject$.next(true);

        const user = this.authService.getCurrentUser();

        await this.authService.login(user.getUsername(), this.form.value.oldPassword);

        await user.save({ password: this.form.value.password });

        this.isLoadingBSubject$.next(false);

        await this.modalCtrl.dismiss(true);
      } catch (error) {
        this.isLoadingBSubject$.next(false);
        if (error.code === 101) {
          await this.presentToast('PASSWORD_INVALID');
        } else if (error.code === 141) {
          await this.presentToast(error.message);
        } else {
          await this.presentToast('ERROR_NETWORK');
        }
      }
    }
  }

  async onClose() {
    await this.modalCtrl.dismiss();
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
