import { Component, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { CourService } from 'src/app/services/cours.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage {
  cours: any;
  userRole: any;
  user: any;

  constructor(private modalCtrl: ModalController, private coursServie: CourService, private authService: AuthService) {}

  async onDelete() {
    await this.coursServie.deleteCours(this.cours.id);
    this.modalCtrl.dismiss(true);
  }

  onClose() {
    this.modalCtrl.dismiss();
  }

  async ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.userRole = await this.authService.getRole(this.user);
    // await this.menuCtrl.enable(true);
    this.getCours();
  }
  getCours() {}
}
