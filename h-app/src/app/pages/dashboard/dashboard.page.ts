import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CourService } from '../../services/cours.service';

import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import localeFR from '@angular/common/locales/fr';
import { CreatePage } from './create/create.page';
import { DetailPage } from './detail/detail.page';

import { startOfDay, addHours } from 'date-fns';
import { Subject } from 'rxjs';

import { CalendarEvent, CalendarView } from 'angular-calendar';
import { registerLocaleData } from '@angular/common';

const colors: any = {
  blue: {
    primary: '#1e90ff',
  },
};

registerLocaleData(localeFR, 'fr');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  view: CalendarView = CalendarView.Week;
  userRole: any;
  cours: CalendarEvent[] = [];

  CalendarView = CalendarView;

  isLoading = false;
  viewDate: Date = new Date();

  modalData: {
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = true;
  user: any;

  constructor(
    private authService: AuthService,
    private coursService: CourService,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  async onShowDetails(event: CalendarEvent) {
    const loading = await this.loadingCtrl.create({ message: " Attendez s'il vous plaît..." });
    await loading.present();

    try {
      const cours = await this.coursService.getCour(event.meta.id);

      const modal = await this.modalCtrl.create({ component: DetailPage, componentProps: { cours }, backdropDismiss: false });
      this.loadingCtrl.dismiss();
      await modal.present();

      modal.onDidDismiss().then((result) => {
        if (result.data) {
          this.getCours();
        }
      });
    } catch (error) {
      const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
      toast.present();
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  async ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.userRole = await this.authService.getRole(this.user);
    this.getCours();
  }

  async onLogout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }

  async onCreate() {
    try {
      const modal = await this.modalCtrl.create({ component: CreatePage, backdropDismiss: false });
      await modal.present();

      modal.onDidDismiss().then(async (result) => {
        if (result.data) {
          this.getCours();
          const toast = await this.toastCtrl.create({ message: 'cours_créé', duration: 2000 });
          toast.present();
        }
      });
    } catch (error) {
      const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
      toast.present();
    }
  }
  private async getCours(params: any = {}) {
    try {
      this.isLoading = true;
      const cours = await this.coursService.getCours(params);

      this.cours = [];

      cours.forEach((c) => {
        if (c.get('duree') === 'matin') {
          this.cours.push({
            start: addHours(startOfDay(Date.parse(c.get('date'))), 9),
            end: addHours(startOfDay(Date.parse(c.get('date'))), 13),
            title: c.get('name') + '\n ' + c.get('formateur').get('name'),
            meta: c,
            color: colors.blue,
          });
        } else if (c.get('duree') === 'apres-midi') {
          this.cours.push({
            start: addHours(startOfDay(Date.parse(c.get('date'))), 14),
            end: addHours(startOfDay(Date.parse(c.get('date'))), 17),
            title: c.get('name') + '\n ' + c.get('formateur').get('name'),
            meta: c,
            color: colors.blue,
          });
        } else {
          this.cours.push({
            start: addHours(startOfDay(Date.parse(c.get('date'))), 9),
            end: addHours(startOfDay(Date.parse(c.get('date'))), 17),
            title: c.get('name') + '\n ' + c.get('formateur').get('name'),
            meta: c,
            color: colors.blue,
          });
        }
      });
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
      toast.present();
    }
  }
}
