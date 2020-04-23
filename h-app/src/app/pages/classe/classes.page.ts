import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';

import { CreatePage } from './create/create.page';
import { DetailPage } from './detail/detail.page';

import { AuthService } from '../../services/auth.service';
import { ClasseService } from '../../services/classe.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss'],
})
export class ClassesPage implements OnInit {
  user: any;
  userRole: any;
  classes: any[] = [];
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
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
    this.getClasses();
  }

  async onCreate() {
    try {
      const modal = await this.modalCtrl.create({ component: CreatePage, backdropDismiss: false });
      await modal.present();

      modal.onDidDismiss().then(async (result) => {
        if (result.data) {
          this.getClasses();
          const toast = await this.toastCtrl.create({ message: 'classe_créée', duration: 2000 });
          toast.present();
        }
      });
    } catch (error) {
      const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
      toast.present();
    }
  }

  async onShowDetails(id: string) {
    const loading = await this.loadingCtrl.create({ message: "Attendez s'il vous plaît..." });
    await loading.present();

    try {
      const classe = await this.classeService.getClasse(id);
      const query = classe.get('users').query();
      const users = await query.find();

      const modal = await this.modalCtrl.create({ component: DetailPage, componentProps: { classe, users }, backdropDismiss: false });
      this.loadingCtrl.dismiss();
      await modal.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
      toast.present();
    }
  }

  async onDelete(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Supprimer cette classe',
      message: 'Êtes-vous sûr de supprimer cette classe ?',
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
          await this.classeService.deleteClasse(id);
          this.getClasses();
          const toast = await this.toastCtrl.create({ message: 'Classe supprimée', duration: 2000 });
          toast.present();
        } catch (error) {
          const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
          toast.present();
        }
      }
    });
  }

  async onSearch(event: any) {
    this.getClasses({ searchTerm: event.detail.value.trim() });
  }

  async onLogout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  private async getClasses(params: any = {}) {
    try {
      this.isLoading = true;
      this.classes = await this.classeService.getClasses(params);
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      const toast = await this.toastCtrl.create({ message: error.message, duration: 2000 });
      toast.present();
    }
  }
}
