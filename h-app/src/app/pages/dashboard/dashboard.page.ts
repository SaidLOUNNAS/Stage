import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CourService } from '../../services/cours.service';

import { ModalController, MenuController, ToastController } from '@ionic/angular';
import { CreatePage } from './create/create.page';

import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';

import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Week;

  cours: CalendarEvent[] = [];

  CalendarView = CalendarView;
  isLoading = false;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      title: 'A 3 day event',
      color: colors.red,
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'moiccccccccccccccccccccccccccccccccc',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 1),
      end: addHours(new Date(), 2),
      title: 'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  activeDayIsOpen: boolean = true;

  constructor(
    private modal: NgbModal,
    private authService: AuthService,
    private coursService: CourService,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private router: Router
  ) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  async handleEvent(action: string, event: CalendarEvent) {
    console.log(event);
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
    // this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  async ngOnInit() {
    await this.menuCtrl.enable(true);
    this.getCours();
  }

  async onLogout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }

  //creer une une page pour ajouter les evenments

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
            title: c.get('name') + '\n' + c.get('formateur').get('name'),
            meta: c,
            color: colors.blue,
          });
        } else if (c.get('duree') === 'apres-midi') {
          this.cours.push({
            start: addHours(startOfDay(Date.parse(c.get('date'))), 13),
            end: addHours(startOfDay(Date.parse(c.get('date'))), 18),
            title: c.get('name'),
            color: colors.blue,
          });
        } else {
          this.cours.push({
            start: addHours(startOfDay(Date.parse(c.get('date'))), 9),
            end: addHours(startOfDay(Date.parse(c.get('date'))), 18),
            title: c.get('name'),
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
