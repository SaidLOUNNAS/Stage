import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';

import { CreatePage } from './create/create.page';
import { DetailPage } from './detail/detail.page';

import { AuthService } from 'src/app/services/auth.service';
import { FormateurService } from '../../services/formateur.service';

@Component({
  selector: 'app-formateurs',
  templateUrl: './formateurs.page.html',
  styleUrls: ['./formateurs.page.scss'],
})
export class FormateursPage implements OnInit {
  user: any;
  userRole: any;

  formateurs: any[] = [];

  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private formateurService: FormateurService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.userRole = await this.authService.getRole(this.user);
    this.getFormateurs();
  }

  async onCreate() {
    try {
      const modal = await this.modalCtrl.create({ component: CreatePage, backdropDismiss: false });
      await modal.present();

      modal.onDidDismiss().then(async (result) => {
        if (result.data) {
          this.getFormateurs();
          const toast = await this.toastCtrl.create({ message: 'Formateur_créé', duration: 2000 });
          toast.present();
        }
      });
    } catch (error) {
      const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
      toast.present();
    }
  }

  async onShowDetails(id: string) {
    const loading = await this.loadingCtrl.create({ message: " Attendez s'il vous plaît..." });
    await loading.present();

    try {
      const formateur = await this.formateurService.getFormateur(id);

      const modal = await this.modalCtrl.create({ component: DetailPage, componentProps: { formateur }, backdropDismiss: false });
      this.loadingCtrl.dismiss();
      await modal.present();
    } catch (error) {
      console.log(error);
      const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
      toast.present();
    }
  }

  async onDelete(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Supprimer un formateur',
      message: 'Êtes-vous sûr de supprimer cet formateur ?',
      buttons: [
        {
          text: 'Non',
          role: 'Annuler',
        },
        {
          text: 'Oui',
          role: 'ok',
        },
      ],
    });
    await alert.present();

    alert.onDidDismiss().then(async (result) => {
      if (result.role === 'ok') {
        try {
          await this.formateurService.deleteFormateur(id);
          this.getFormateurs();
          const toast = await this.toastCtrl.create({ message: 'Formateur supprimé', duration: 2000 });
          toast.present();
        } catch (error) {
          const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
          toast.present();
        }
      }
    });
  }

  async onSearch(event: any) {
    this.getFormateurs({ searchTerm: event.detail.value.trim() });
  }

  async onLogout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }

  private async getFormateurs(params: any = {}) {
    try {
      this.isLoading = true;
      this.formateurs = await this.formateurService.getFormateurs(params);
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
      toast.present();
    }
  }
}
