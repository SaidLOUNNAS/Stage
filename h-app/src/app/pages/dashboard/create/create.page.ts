import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ModalController } from '@ionic/angular';

import { CourService } from '../../../services/cours.service';
import { startOfDay, subDays, addDays } from 'date-fns';
import { FormateurService } from 'src/app/services/formateur.service';
import { ClasseService } from 'src/app/services/classe.service';

@Component({
  selector: 'app-cours-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  form: FormGroup;
  user: any;

  classes = [];
  formateurs = [];

  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private classeService: ClasseService, private formateurService: FormateurService, private coursService: CourService, private modalCtrl: ModalController) {}

  async ngOnInit() {
    this.setupForm();
    this.formateurs = await this.formateurService.getFormateurs();
    this.classes = await this.classeService.getClasses();
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.isLoading = true;
        await this.coursService.createCours(this.form.value);
        this.isLoading = false;
        this.modalCtrl.dismiss(true);
      } catch (error) {
        this.isLoading = false;
      }
    }
  }

  compareFn = (o1: any, o2: any) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  onClose() {
    this.modalCtrl.dismiss();
  }

  private setupForm() {
    this.form = this.fb.group({
      title: [null, Validators.compose([Validators.required])],
      classe: [null],
      formateur: [null],
      date: ['1990-02-19T00:00:00+01:00'],
      duree: ['matin'],
    });
  }
}
