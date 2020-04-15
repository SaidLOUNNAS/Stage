import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-users-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailPage {
  @Input() user: any;

  constructor(private modalCtrl: ModalController) {}

  async onClose() {
    await this.modalCtrl.dismiss();
  }
}
