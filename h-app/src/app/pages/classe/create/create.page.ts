import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ModalController } from '@ionic/angular';

import { ClasseService } from '../../../services/classe.service';

@Component({
  selector: 'app-classe-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  form: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private classeService: ClasseService, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.setupForm();
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.isLoading = true;
        await this.classeService.createClasse(this.form.value);
        this.isLoading = false;
        this.modalCtrl.dismiss(true);
      } catch (error) {
        this.isLoading = false;
      }
    }
  }

  onClose() {
    this.modalCtrl.dismiss();
  }

  private setupForm() {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
    });
  }
}
