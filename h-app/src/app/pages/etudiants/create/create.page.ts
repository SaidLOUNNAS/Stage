import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Base } from '../../base/base';

import { CustomValidators } from '../../../utils/CustomValidators';

import { Patterns } from '../../../utils/Patterns';

import { EtudiantService } from '../../../services/user.service';

@Component({
  selector: 'app-users-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePage extends Base implements OnInit {
  form: FormGroup;

  constructor(injector: Injector, private fb: FormBuilder, private userService: EtudiantService) {
    super(injector);
  }

  ngOnInit() {
    this.setupForm();
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.isLoadingBSubject$.next(true);
        await this.userService.createEtudiant(this.form.value);
        this.isLoadingBSubject$.next(false);
        await this.modalCtrl.dismiss(true);
      } catch (error) {
        this.isLoadingBSubject$.next(false);
        if (error.code === 202 || error.code === 203) {
          await this.presentToast('EMAIL_TAKEN');
        } else if (error.code === 125) {
          await this.presentToast('EMAIL_INVALID');
        } else if (error.code === 141) {
          await this.presentToast(error.message);
        } else {
          await this.presentToast('ERROR_NETWORK');
          console.log(error.message);
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
        name: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(24)])],
        date_naissance: [
          null,
          Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(24)]),
        ],
        absences: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(24)])],
        class: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(24)])],
        email: [
          null,
          Validators.compose([Validators.required, CustomValidators.patternValidator(Patterns.email, { email: true })]),
        ],
        phone: [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(24)])],

        password: [
          null,
          Validators.compose([
            Validators.required,
            CustomValidators.patternValidator(Patterns.password, { password: true }),
          ]),
        ],
        confirmPassword: [null],
      },
      {
        validator: CustomValidators.passwordMatchValidator,
      }
    );
  }
}
