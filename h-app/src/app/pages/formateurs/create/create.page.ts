import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Base } from '../../base/base';

import { CustomValidators } from '../../../utils/CustomValidators';

import { Patterns } from '../../../utils/Patterns';

import { FormateurService } from '../../../services/formateur.service';

@Component({
  selector: 'app-formateur-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePage extends Base implements OnInit {
  form: FormGroup;

  constructor(injector: Injector, private fb: FormBuilder, private formateurService: FormateurService) {
    super(injector);
  }

  ngOnInit() {
    this.setupForm();
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.isLoadingBSubject$.next(true);
        await this.formateurService.createFormateur(this.form.value);
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
        email: [
          null,
          Validators.compose([Validators.required, CustomValidators.patternValidator(Patterns.email, { email: true })]),
        ],
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

//formateur serveur
