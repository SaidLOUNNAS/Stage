import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailModule } from './detail/detail.module';
import { CreateModule } from './create/create.module';
import { FormateursPage } from './formateurs.page';

const routes: Routes = [
  {
    path: '',
    component: FormateursPage,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), IonicModule, DetailModule, CreateModule],
  declarations: [FormateursPage],
})
export class FormateursModule {}
