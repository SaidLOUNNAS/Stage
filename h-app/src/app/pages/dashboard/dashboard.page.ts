import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';

import { Base } from '../base/base';

import { AuthService } from '../../services/auth.service';
import { CalendarComponentOptions } from 'ion2-calendar';

import { ModalController } from '@ionic/angular';

import { CalendarModal, CalendarModalOptions } from 'ion2-calendar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage extends Base implements OnInit {
  cuser: any;
  dateRange: { from: string; to: string };
  type: 'string';

  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
  };

  constructor(injector: Injector, private authService: AuthService, public modalCtrl: ModalController) {
    super(injector);
  }
  async openCalendar() {
    const options: CalendarModalOptions = {
      title: 'BASIC',
      color: 'danger',
    };

    let myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options },
    });

    myCalendar.present();
  }

  async ngOnInit() {
    this.cuser = this.authService.getCurrentUser();
    await this.menuCtrl.enable(true);
  }

  async onLogout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
  onChange($event) {
    console.log($event);
  }
}
