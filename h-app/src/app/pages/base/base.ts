import { Injector } from '@angular/core';

import { Router } from '@angular/router';

import { ModalController, AlertController, LoadingController, ToastController, MenuController } from '@ionic/angular';

import { BehaviorSubject, Observable } from 'rxjs';

export abstract class Base {
  protected router: Router;
  protected modalCtrl: ModalController;
  protected toastCtrl: ToastController;
  protected loadingCtrl: LoadingController;
  protected alertCtrl: AlertController;
  protected menuCtrl: MenuController;

  protected objectsBSubject$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  protected isLoadingBSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public objects$: Observable<any> = this.objectsBSubject$.asObservable();
  public isLoading$: Observable<boolean> = this.isLoadingBSubject$.asObservable();

  constructor(injector: Injector) {
    this.router = injector.get(Router);
    this.modalCtrl = injector.get(ModalController);
    this.toastCtrl = injector.get(ToastController);
    this.loadingCtrl = injector.get(LoadingController);
    this.alertCtrl = injector.get(AlertController);
    this.menuCtrl = injector.get(MenuController);
  }

  protected async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    await toast.present();
  }

  protected async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({ message });
    await loading.present();
  }
}
