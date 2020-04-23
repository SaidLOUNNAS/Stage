import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { CustomValidators } from '../../../utils/CustomValidators';
import { ModalController, ToastController } from '@ionic/angular';
import { FormateurService } from '../../../services/formateur.service';

@Component({
  selector: 'app-formateur-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  @Input() classes: any = [];
  form: FormGroup;

  isLoading: boolean = false;
  constructor(private fb: FormBuilder, private userService: FormateurService, private modalCtrl: ModalController, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.setupForm();
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.isLoading = true;
        await this.userService.createFormateur(this.form.value);
        this.isLoading = false;
        this.modalCtrl.dismiss(true);
      } catch (error) {
        this.isLoading = false;
        if (error.code === 202 || error.code === 203) {
          const toast = await this.toastCtrl.create({ message: 'Adresse email deja utilisé', duration: 2000 });
          toast.present();
        } else if (error.code === 125) {
          const toast = await this.toastCtrl.create({ message: "Adresse email n'est pas valide", duration: 2000 });
          toast.present();
        } else {
          const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
          toast.present();
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
        name: [null, Validators.compose([Validators.required])],
        dat: [null, Validators.compose([Validators.required])],
        phone: [null, Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.required, Validators.email])],
        password: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
        confirmPassword: [null],
      },
      {
        validator: CustomValidators.passwordMatchValidator,
      }
    );
  }
}
