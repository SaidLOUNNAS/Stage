import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateModule } from './create/create.module';
import { DetailModule } from './detail/detail.module';

import { ClassesPage } from './classes.page';

const routes: Routes = [
  {
    path: '',
    component: ClassesPage,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), IonicModule, CreateModule, DetailModule],
  declarations: [ClassesPage],
})
export class ClassesModule {}
