import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DashboardPage } from './dashboard.page';

import { FormsModule } from '@angular/forms';

// Calendar UI Module
import { CalendarModule } from 'ion2-calendar';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), IonicModule, CalendarModule, FormsModule],

  declarations: [DashboardPage],
  providers: [{ provide: LOCALE_ID, useValue: 'zh-CN' }],
})
export class DashboardModule {}
