import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePasswordPage } from './change-password.page';

@NgModule({
  declarations: [ChangePasswordPage],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
})
export class ChangePasswordModule {}
