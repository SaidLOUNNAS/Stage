import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';

import { CreatePage } from './create/create.page';
import { DetailPage } from './detail/detail.page';

import { AuthService } from 'src/app/services/auth.service';
import { EtudiantService } from '../../services/etudiant.service';
import { ClasseService } from 'src/app/services/classe.service';

@Component({
  selector: 'app-etudiants',
  templateUrl: './etudiant.page.html',
  styleUrls: ['./etudiant.page.scss'],
})
export class EtudiantPage implements OnInit {
  user: any;
  userRole: any;

  etudiants: any[] = [];

  isLoading = false;

  constructor(
    private authService: AuthService,
    private etudiantService: EtudiantService,
    private classeService: ClasseService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.userRole = await this.authService.getRole(this.user);
    this.getEtudiants();
  }

  async onCreate() {
    try {
      const classes = await this.classeService.getClasses();
      const modal = await this.modalCtrl.create({ component: CreatePage, componentProps: { classes }, backdropDismiss: false });
      await modal.present();

      modal.onDidDismiss().then(async (result) => {
        if (result.data) {
          this.getEtudiants();
          const toast = await this.toastCtrl.create({ message: 'ETUDIANT_CREATED', duration: 2000 });
          toast.present();
        }
      });
    } catch (error) {}
  }

  async onShowDetails(id: string) {
    const loading = await this.loadingCtrl.create({ message: 'Please wait...' });
    await loading.present();

    try {
      const etudiant = await this.etudiantService.getEtudiant(id);

      const classe = await this.etudiantService.getClasseByEtudiant(etudiant);

      const modal = await this.modalCtrl.create({ component: DetailPage, componentProps: { etudiant, classe }, backdropDismiss: false });
      this.loadingCtrl.dismiss();
      await modal.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
      toast.present();
    }
  }

  async onDelete(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Delete user',
      message: 'Are you sure delete this user ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          role: 'ok',
        },
      ],
    });
    await alert.present();

    alert.onDidDismiss().then(async (result) => {
      if (result.role === 'ok') {
        try {
          await this.etudiantService.deleteEtudiant(id);
          this.getEtudiants();
          await this.presentToast('USER_DELETED');
        } catch (error) {
          await this.presentToast(error.message);
        }
      }
    });
  }

  async onSearch(event: any) {
    this.params = { ...this.params, searchTerm: event.detail.value.trim().toLowerCase() };
    this.getEtudiants();
  }

  async onRefresh() {
    this.params = { searchTerm: '', order: 'updatedAtDesc' };
    await this.getEtudiants();
    await this.ionRefresher.complete();
    this.isSortedBSubject$.next(false);
  }

  async onLogout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }

  trackByFn(index: number, user: any) {
    return user ? user.id : index;
  }

  private async getEtudiants(params: any = {}) {
    try {
      this.isLoading = true;
      this.etudiants = await this.etudiantService.getEtudiants(params);
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      const toast = await this.toastCtrl.create({ message: error, duration: 2000 });
      toast.present();
    }
  }
}
