import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ModalController, ToastController } from '@ionic/angular';

import { CustomValidators } from '../../../utils/CustomValidators';

import { EtudiantService } from '../../../services/etudiant.service';

@Component({
  selector: 'app-users-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  @Input() classes: any[] = [];

  form: FormGroup;

  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private userService: EtudiantService, private modalCtrl: ModalController, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.setupForm();
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.isLoading = true;
        await this.userService.createEtudiant({ ...this.form.value, classe: this.form.value.classe.toPointer() });
        this.isLoading = false;
        this.modalCtrl.dismiss(true);
      } catch (error) {
        this.isLoading = false;
        if (error.code === 202 || error.code === 203) {
          const toast = await this.toastCtrl.create({ message: 'Adresse email déja utilisé', duration: 2000 });
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
    this.modalCtrl.dismiss();
  }

  compareFn = (o1: any, o2: any) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  private setupForm() {
    this.form = this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])],
        date_naissance: [null, Validators.compose([Validators.required])],
        classe: [null],
        email: [null, Validators.compose([Validators.required, Validators.email])],
        phone: [null, Validators.compose([Validators.required])],
        password: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
        confirmPassword: [null],
      },
      {
        validator: CustomValidators.passwordMatchValidator,
      }
    );
  }
}
