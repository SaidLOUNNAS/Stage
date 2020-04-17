import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Base } from '../../base/base';

import { CustomValidators } from '../../../utils/CustomValidators';

// import { Patterns } from '../../../utils/Patterns';

import { CourService } from '../../../services/cour.service';

@Component({
  selector: 'app-cour-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePage extends Base implements OnInit {
  form: FormGroup;

  constructor(injector: Injector, private fb: FormBuilder, private courService: CourService) {
    super(injector);
  }

  ngOnInit() {
    this.setupForm();
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.isLoadingBSubject$.next(true);
        await this.courService.createCour(this.form.value);
        this.isLoadingBSubject$.next(false);
        await this.modalCtrl.dismiss(true);
      } catch (error) {
        this.isLoadingBSubject$.next(false);
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
        Class: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(24)])],
        formateur: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(24)])],
        dat: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(24)])],
        duree: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(24)])],
      },
      {
        validator: CustomValidators.passwordMatchValidator,
      }
    );
  }
}
