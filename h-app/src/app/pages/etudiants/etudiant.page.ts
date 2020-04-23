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

  isLoading: boolean = false;

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
          const toast = await this.toastCtrl.create({ message: 'Etudiant_créé', duration: 2000 });
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
      const etudiant = await this.etudiantService.getEtudiant(id);

      const classe = await this.etudiantService.getClasseByEtudiant(etudiant);

      const modal = await this.modalCtrl.create({ component: DetailPage, componentProps: { etudiant, classe }, backdropDismiss: false });
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
      header: "Supprimer l'étudiant",
      message: 'Êtes-vous sûr de supprimer cet étudiant ?',
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
          await this.etudiantService.deleteEtudiant(id);
          this.getEtudiants();
          const toast = await this.toastCtrl.create({ message: 'Etudiant supprimé', duration: 2000 });
          toast.present();
        } catch (error) {
          const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
          toast.present();
        }
      }
    });
  }

  async onSearch(event: any) {
    this.getEtudiants({ searchTerm: event.detail.value.trim() });
  }

  async onLogout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
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
